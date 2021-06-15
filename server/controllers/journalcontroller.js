let Express = require('express');
let router = Express.Router();
//Router() method returns a router object; this enables us to use HTTP methods (like get, put, post, delete, etc)
let validateJWT = require('../middleware/validate-jwt');
const { JournalModel } = require('../models');

router.get('/about', (req, res) => {
    res.send('About endpoint success')
})

//PRACTICE ROUTE
router.get('/practice', validateJWT, (req, res) => { //now we cant access the practice route without a valid token
    res.send('Practice endpoint success.')
})

//*JOURNAL CREATE
router.post('/create', validateJWT, async (req, res) => {
    const { title, date, entry } = req.body.journal;
    const { id } = req.user;

    const journalEntry = {
        title,
        date,
        entry,
        owner: id
    }

    try {
        const newJournal = await JournalModel.create(journalEntry);
        res.status(200).json(newJournal);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    //JournalModel.create(journalEntry); //*THIS is where the double comes from
});

//*GET ALL JOURNALS
router.get('/', async (req, res) => {
    try {
        const entries = await JournalModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//*GET MY JOURNALS
router.get('/mine', validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userJournals = await JournalModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userJournals);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//*GET JOURNALS BY TITLE
router.get('/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const results = await JournalModel.findAll({
            where: {
                title: title
            }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

//*JOURNAL UPDATE
router.put('/update/:entryId', validateJWT, async (req, res) => {
    const { title, date, entry } = req.body.journal;
    const journalId = req.params.entryId;
    const userId = req.user.id;

    const query = {
        where: {
            id: journalId,
            owner: userId
        }
    };

    const updatedJournal = {
        title: title,
        date: date,
        entry: entry
    };

    try {
        const update = await JournalModel.update(updatedJournal, query);
        res.status(200).json({ update, updatedJournal });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//*JOURNAL DELETE
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const journalId = req.params.id;

    try{
        const query = {
            where: {
                id: journalId,
                owner: ownerId
            }
        };

        await JournalModel.destroy(query);
        res.status(200).json({ message: "Journal Entry Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router