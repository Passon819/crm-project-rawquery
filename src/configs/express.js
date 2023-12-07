const express = require('express');

module.exports = async (app) =>{

    // Connect Database

    //Parser body
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

}