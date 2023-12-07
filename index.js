const express = require('express');
const app = express();
const config = require('./src/configs/app');

// Express configs
require('./src/configs/express')(app)

// Routes
app.use(require('./src/routes'))

// Start Server
const server = app.listen(config.serverPort, ()=>{
    let host = server.address().address
    let port = server.address().port
    console.log(`Server is running at http://${host}:${port}`)
})

