import mongoose from "mongoose";
const productSchemas = new mongoose.Schema({
    desccription: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    productImage: {
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    stocks: {
        default: 0,
        type: Number
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export const Product = mongoose.model("Product", productSchemas)

