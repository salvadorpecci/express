import  express  from 'express'
import * as usersController from '../controllers/user.js'

const router = express.Router()

    router
     .post('/signUp', usersController.signUp)
     .post('/login', usersController.login)

export default router
