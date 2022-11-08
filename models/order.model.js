import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const orderSchema = new Schema({
    number: String,
    carPlate: String,
    contactName: String,
    contactEmail: {
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
    },
    phone: { type: String, minLength: [9] },
    address: {
        type: String,
    },
    minDate: Date,
    maxDate: Date,
    reference: String,
    store: String,
    priority: String
});

const Order = model('Order', orderSchema);

export default Order;