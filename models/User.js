const mongoose = require('../db');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

userSchema.statics.signUp = async function (username, email, password) {
    const salt = await bcrypt.genSalt();
    console.log(salt);
    try {
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await this.create({ username, email, password: hashedPassword });
        return {
            _id: user._id,
            username: user.username,
            email: user.email,
            password: user.password
        };
    } catch (err) {
        throw err;
    }
};


userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // username을 포함하여 반환
            return {
                _id: user._id,
                email: user.email,
                username: user.username
            };
        }
        throw new Error("Incorrect password");
    }
    throw new Error("Incorrect email");
};


const visibleUser = userSchema.virtual("visibleUser");
visibleUser.get((value, virtual, doc) => {
    return {
        _id: doc._id,
        email: doc.email,
    };
});

const User = mongoose.model("user", userSchema);

module.exports = User;