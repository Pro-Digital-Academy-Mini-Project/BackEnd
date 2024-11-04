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

userSchema.statics.signUp = async function (email, password) {
    const salt = await bcrypt.genSalt();
    console.log(salt);
    try {
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await this.create({ email, password: hashedPassword });
        return {
            _id: user._id,
            email: user.email,
        };
    } catch (err) {
        throw err;
    }
};

userSchema.statics.login = async function (email, password) {
    if (await this.findOne({ email })) {
        if (await bcrypt.compare(password, (await this.findOne({ email })).password)) {
            return (await this.findOne({ email })).visibleUser;
        }
        throw Error("incorrect password");
    }
    throw Error("incorrect email");
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