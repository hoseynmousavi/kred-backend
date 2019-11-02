import mongoose from "mongoose"

const schema = mongoose.Schema

const cityModel = new schema({
    name: {
        type: String,
        required: "Enter Name!",
    },
})

export default cityModel