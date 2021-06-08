//* SEQUELIZE
/*
    SQL (Structured Query Language) database management systems are NOT object-oriented
    Therefore, they can only use "scalar" values like integers/numbers and strings
    Sequelize, as an ORM (Object-Relational Mapping tool), CONVERTS or TRANSLATES the objects we give it into simpler values.
    This allows us to use things like dot notation when we want to make queries, as opposed to writing in an SQL dialect (which is what PostgreSQL is) which is much more wordy and complex

    https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping#Overview
    (
        var sql = "#";
        # is where the SQL query is--see how much longer it is?
    )
*/
//See module 5.1 for database information
//See module 6.2 for setup of this file

const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:ThisIsAnOgre@localhost:5432/journal-walkthrough-two-06072021")

module.exports = sequelize