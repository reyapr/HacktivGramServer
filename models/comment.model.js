const mongoose = require('mongoose')
const { Schema } = mongoose

const commentSchema = new Schema ({
    content: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
})

const comment  = mongoose.model('comment', commentSchema)

module.exports = comment