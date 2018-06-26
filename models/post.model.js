const mongoose = require('mongoose')
const { Schema } =  mongoose

const postSchema = new Schema ({
    content: String,
    image: String,
    comment : [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    like: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
})

const post = mongoose.model('post', postSchema)

module.exports = post