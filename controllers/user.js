//eslist-disable-next-line
import  sxpress  from 'express'
import User from '../models/User.js'
import createToken from '../utils/createToken.js'

/**
 * @param {express.Request} request 
 * @param {express.Response} response 
 */

export function signUp (request, response) {
    const { email, password } = request.body

    if(typeof email !== 'string' || typeof password !== 'string') {
        response.status(400)
        response.send({ message: 'Bad request '})
        return 
    }

    User.signUp(email, password)
        .then(user => {
            const token = createToken(user._id)
            response.send({ email, token })
        })
        .catch(error =>{
            response.status(400)
            if (error instanceof Error) {
                response.send({ message: error.message})
            } else {
                response.send({ message: error })
            }
        })
}


/**
 * @param {express.Request} request 
 * @param {express.Response} response 
 */
export function login (request, response) {
    const { email, password } = request.body

    if(typeof email !== 'string' || typeof password !== 'string') {
        response.status(400)
        response.send({ message: 'Bad request '})
        return 
    }

    User.login(email, password)
        .then(user => {
            const token = createToken(user._id)
            response.send({ email, token })
        })
        .catch(error =>{
            response.status(400)
            if (error instanceof Error) {
                response.send({ message: error.message})
            } else {
                response.send({ message: error })
            }
        })
}