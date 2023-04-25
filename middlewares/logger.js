import  express  from "express"

/**
 * @param {express.Request} request 
 * @param {express.Response} response 
 * @param {express.NextFunction} next 
 */

export default function logger (request, response, next) {

    console.log(`${request.method} ${request.url}`)
    next()
}