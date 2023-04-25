import { Schema, model } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.statics.signUp = async function(email, password) {

    if(!validator.isEmail(email)) {
        throw new Error(`"${email}" is not a valid email`)
    }

    
    if(!validator.isStrongPassword(password)) {
        throw new Error(`"${password}" The password must contain at least 8 characters, lowercase, uppercase,
        number and special characters`)
    }

    const userWithSameEmail = await this.findOne({ email })// usamos eso pq el user aun no existe
    if(userWithSameEmail != null) {
        throw new Error(`"${email}" is already in use`)
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hashSync(password, salt)

    const user = await this.create({email, password: hashedPassword}) // esto nos crea y nos inyecta en la bbdd el usuario

    return user
}
userSchema.statics.login = async function(email, password) {
    if (!validator.isEmail(email)) {
        throw new Error(`"${email}" is not a valid email`)
    }

    const user = await this.findOne({ email })

    if(user == null) {
        throw new Error(`User with email "${email} doesn't exist"`)
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password) 

    if(!isCorrectPassword) {
        throw new Error('Incorrect password')
    }

    return user
}

export default model('User', userSchema)