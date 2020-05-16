const mongoose = require('../../etc/services/mongoose.service').mongoose
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    permissionLevel: Number
})

userSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

userSchema.set('toJSON', {
    virtuals: true
})

userSchema.findById = function (cb) {
    return this.model('Users').find({id: this.id}, cb)
}

const User =  mongoose.model('Users', userSchema)

exports.createUser = (userData) => {
    const user = new User(userData)
    return user.save()
}

exports.findById = (id) => {
    return User.findById(id).then((result) => {
        result = result.toJSON()
        delete result._id
        delete result.__v
        return result
    })
}

exports.patchUser = (id, userData) => {
    return new Promise((resolve, reject) => {
        User.findById(id, (err, user) => {
            if (err) 
                reject(err)
            for (let i in userData)
                user[i] = userData[i]
            user.save((err, updatedUser) => {
                if (err) 
                    return reject(err)
                resolve(updatedUser)
            })
        })
    })
}

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec((err, users) => {
                if (err)
                    reject(err)
                else
                    resolve(users)
            })
    })
}

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.remove({_id: userId}, (err) => {
            if (err)
                reject(err)
            else 
                resolve(err)
        })
    })
}