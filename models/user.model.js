import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

var { Schema, model } = mongoose;

export var userSchema = new Schema({
    name: String,
    lastName: String,
    email: {
        type: String,
        lowercase: true,
        index: true,
        unique: true,
        validate: {
            validator: (value) => {
                return /(^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+))\w+/g.test(value)
            },
            message: props => `${props.value} no es un correo electrónico`
        },
        required: [true, 'Debes ingresar un correo electrónico.'],
    },
    dni: {
        type: String,
        minlength: [8]
    },
    phone: {
        type: String,
        minlength: [8]
    },
    role: [String],
    address: String,
    subaddress: String,
    enterprise: String,
    hash: { type: String },
    salt: { type: String },
},
    {
        timestamps: true,
    }
);

userSchema.methods.setPassword = (password) => {

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 200000, 64, 'sha512').toString('hex');
    return { salt: salt , hash: hash }
};

userSchema.methods.checkNewPassword = (password) => {
    if (password.length < 6)
        return false
    else if (!/[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+/g.test(password))
        return false
    else return true
}

userSchema.methods.createToken = (user) => {
    const today = new Date();
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + process.env.EXPIRATION_TOKEN_TIME)

    const token = jwt.sign({
        id: user._id,
        email: user.email,
        role: (typeof user.role !== 'undefined') ? user.role : '',
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, process.env.SECRET_REQUIRED)

    return token
}

const User = model('User', userSchema);

export default User;
