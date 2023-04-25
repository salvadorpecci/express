import express, { request, response } from 'express'
import validator from 'validator'
import Task from '../models/Task.js'
import { Types } from 'mongoose'
import moment from 'moment'


/**
 * @param {express.Request} request 
 * @param {express.Response} response 
 */
export function getAll (request, response) {
  const userId = request.user?._id

    Task.find({ userId })
    .then(tasks => response.send([...tasks]))
    .catch(error => {
      response
        .status(500)
        .send({ message: error })
    })
}


/**
 * @param {express.Request} request 
 * @param {express.Response} response 
 */
export function getById (request, response) {
  const {id} = request.params
  const userId = request.user?._id
      
  if(!Types.ObjectId.isValid(id)){
    response
      .status(400)
      .send({ error: 'Bad request'})
      return

  }

  Task.findById(id)
    .then(task => {
      if (task == null || task.userId !== userId.toString()){
        response
          .status(404)
          .send({message: `Task with id: "${id}" not found`})

          return
      }

      response.send({ task })
    })
    .catch(error => {
      response
        .status(400)
        .send({ message: error})
    })
}

/**
 * @param {express.Request} request 
 * @param {express.Response} response 
 */
export function create (request, response) {
  
        const { name, finished, deadline = null } = request.body
        const userId = request.user?._id
         
        if(name == null || name.length === 0 || finished == null || userId == null || !Types.ObjectId.isValid(userId) ){
          response.status(400)
          response.send({ message: 'Bad request' })
     
          return
        }

        if (deadline != null && !validator.isDate(deadline, { format: 'YYYY-MM-DD', delimiters: ['-'] })) {
          response.status(400)
          response.send({ message: 'Date format: YYYY-MM-DD' })
          
          return
        }

        const date = deadline != null ? moment(deadline, 'YYYY-MM-DD').utc().format() : null

        Task.create({name, finished, deadline: date, userId})
          .then(task => {
            response
              .status(201)
              .send({task})
          })
          .catch(error =>{
            response
              .status(500)
              .send({ message: error })
          })   
}

/**
 * @param {express.Request} request 
 * @param {express.Response} response 
 */
export function updateById(request, response) {

  const { name, finished, deadline } = request.body
  const userId = request.user?._id
        if(name == null || 
          name.length === 0 ||
          finished == null || 
          userId == null || 
          !Types.ObjectId.isValid(userId)) {
          response
            .status(400)
            .send({message: 'Bad request'})
          return
        }

      
        const {id} = request.params
        if(!Types.ObjectId.isValid(id)){
          response
            .status(400)
            .send({ message: 'Bad request'})
            return
        }

        const date = moment(deadline, 'YYYY-MM-DD').utc().format()

        Task.findOneAndUpdate({ _id: id, userId }, { name, finished, deadline: date }, { new: true })
          .then(task =>{
            if(task == null) {
              response
                .status(404)
                .send({ message: `Task with id: ${id}`})
              return
            }

            response.send(task)
          })
          .catch(error => {
            response
              .status(500)
              .send({ message: error })
          })


        Task.findById(id)
           
}

export function deleteById(request, response) {
  const { id } = request.params
  if(!Types.ObjectId.isValid(id)){
    response
      .status(400)
      .send({ message: 'Bad request' })
    return
  }

  const userId = request.user?._id
  if(userId == null || !Types.ObjectId.isValid(userId)) {
    response 
      .status(400)
      .send({ message: 'Bad request'})
  }

  Task.findOneAndDelete({ _id: id, userId})
    .then(task => {
      if(task == null) {
        response
          .status(404)
          .send({message: `Task with id "${id} not found"`})
       return   
      }

      response.send(task)
    })
    .catch(error => {
      response
        .status(500)
        .send({ message: error })
    })
 
}