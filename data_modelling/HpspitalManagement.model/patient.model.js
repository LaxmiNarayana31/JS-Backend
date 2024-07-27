import mongoose from "mongoose"

const patientSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    diagonedWith: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    blood: {
        type: String,
        required: trueq
    },
    gender: {
        type: String,
        enums: ["MALE", "FEMALE", "OTHERS"],
        required: true
    },
    admittedIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    }
}, { timestamps: true })

export const Patient = mongoose.model("Patient", patientSchema)