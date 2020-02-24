import mongoose from "mongoose"

const schema = mongoose.Schema

const cityModel = new schema({
    name: {
        type: String,
        required: "Enter name!",
    },
})

export default cityModel