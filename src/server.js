const express = require('express');
const app = express();
const router = require('./routes/userRoutes')
const conn = require('./db/conn');
const cors = require('cors');
require('./models/UserModel')

app.use(cors({
    origin: '*',
}))
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(router)

app.listen(5000, () => {
    console.log("Listening to Port: 5000");
})