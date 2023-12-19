const mongoose = require('mongoose');
const mariadb = require('mariadb');
const mysql = require('mysql');
const config = require('./app');

const databases = {

    // mongoDB() {
    //     const db = mongoose.connect(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, error => {
    //         if (error) console.error('MongoDB error: ', error)
    //         console.log("MongoDB connected")
    //     });
    //     return db;
    // },

    mariaDBCreatePool() {
        const connection = mariadb.createPool({
            host: config.dbHost,
            port: config.dbPort,
            user: config.dbUser,
            password: config.dbPass,
            database: config.dbName
        });
        return connection;
    },

    async mariaDBCreateConnection() {        
        let connection = await mariadb.createConnection({
            host: config.dbHost,
            port: config.dbPort,
            user: config.dbUser,
            password: config.dbPass,
            database: config.dbName
        });
        return connection;
    },

    mySQL() {
        const connection = mysql.createConnection({
            host: config.dbHost,
            port: config.dbPort,
            user: config.dbUser,
            password: config.dbPass,
            database: config.dbName
        });
        return connection;
    }
}

module.exports = databases;