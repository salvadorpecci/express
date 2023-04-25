// eslint-disable-next-line
import  express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/** 
 * @param {express.Request} request 
 * @param {express.Response} response 
 * @param {express.NextFunction} next 
 */

export default function requireAuthorization (request, response, next) {
  const { authorization } = request.headers
  if(authorization == null || authorization.length === 0) {
    response
        .status(400)
        .send({ message: 'Auth token required' })
    return    
  }

  const SECRET = process.env.SECRET
  if(SECRET == null || SECRET.length === 0) {
    response
        .status(500)
        .send({ message: 'Internal server error' })
    return    
  }

  
  try {
    const token = authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, SECRET)
    const { id } = decodedToken
    User.findById(id)
        .then(user => {
            request.user = user
            next()
        })
        .catch(error => {
            response
                .status(400)
                .send({ message: 'User does not exist'} )
        })
  } catch (e) {
    console.error(e)
    response
        .status(401)
        .send({ message: 'Unauthorized request'})
  }
} 