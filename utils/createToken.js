import jwt from 'jsonwebtoken'

/**
 * @param {string} id 
 * @returns string
 */

export default function createToken (id) {
    const SECRET = process.env.SECRET
    if(SECRET == null) {
        throw new Error('No secret env variable founded')
    }
    return jwt.sign({ id }, SECRET, { expiresIn: '1d' })
}