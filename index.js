//MODULE IMPORTS
const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config')

//ROUTE IMPORTS
const admin = require('./routes/admin');
const ticket = require('./routes/ticket');
const passenger = require('./routes/passenger');


(async function connectDB() {
    try {
        //flags to avoid deprecation warnings
        const connect = await mongoose.connect(process.env.DB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("INFO:: CONNECTION ESTABLISHED TO DATABASE:", connect.connections[0].name);
    } catch (err) {
        console.log("ERROR:: CONNECTION ESTABLISHMENT FAILED\n", err);
    }
})();

const app = express();
app.use(express.json());
app.use('/api/admin', admin);
app.use('/api/passenger', passenger);
app.use('/api/ticket', ticket);

var server = app.listen(process.env.PORT, () => {
    console.log("INFO:: STARTING THE DEVELOPMENT SERVER ON PORT:", process.env.PORT);
});

module.exports = server
