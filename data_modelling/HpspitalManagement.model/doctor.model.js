import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    experianceInYears: {
        type: Number,
        required: true
    },
    worksInHospital: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital"
        }
    ]
}, { timestamps: true })

export const Doctors = mongoose.model("Doctors", doctorSchema)