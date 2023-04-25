import {Schema, model} from 'mongoose'

const taskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    finished: {
        type: Boolean,
        required : true
    },
    userId: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
}   
)

export default model('Task', taskSchema)