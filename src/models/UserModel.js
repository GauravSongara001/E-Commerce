const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

userSchema.pre('save', async function (next) {
    try {
        if (this.password || this.isModified(this.password)) {
            this.password = await bcrypt.hash(this.password, 10)
        }
        next();
    } catch (error) {
        console.log("Error while hash pass: ", error);
        next(error)
    }
})

mongoose.model("User", userSchema);
