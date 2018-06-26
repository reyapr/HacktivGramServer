const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')

const userSchema = new Schema ({
    name: {
        type: String,
        required: [true,'You Should Input Your Name']
    },
    email: {
        type: String,
        required: [ true, 'You Should Input Your Email' ],
        unique: [ true, 'Email Already Registered' ],
        validate:{
            isAsync: true,
            validator:(email,callback)=>{
                let emailValidate = /^[a-zA-Z0-9._-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
                callback(emailValidate.test(email),'Email Doesn\'t Meet Criteria' )
            }
        },
        password: {
            type: String,
            required: [true, 'You Should Input Your Password'],
        },
    },
    password: {
        type: String,
        required: [true, 'You Should Input Your Password'],
    },
    posts:[{
        type:Schema.Types.ObjectId,
        ref:'post'
    }]
},{
    timestamps: true
})

userSchema.pre('save', function(next){
    let salt = bcrypt.genSaltSync()
    let includeNum = this.password.match(/\d+/g)

    if (this.password.length < 6 || !includeNum) {
        let err = { message:'user validation failed: password: password to weak, should more than 6 character, and include number'}
        next(err)
    }

    bcrypt.hash(this.password,salt,(err,hashPass)=>{
        if(err){
            console.log(err)
        }else{
            this.password = hashPass
            next()
        }
    })
})

const user = mongoose.model('user', userSchema)

module.exports = user
    