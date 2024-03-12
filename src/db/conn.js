const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

module.exports = mongoose.connect('mongodb://127.0.0.1:27017/practice')
.then(() => console.log('Connected'))
.catch((err) => console.log(err))