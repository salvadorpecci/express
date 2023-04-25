import express from 'express'
import { response } from 'express'
import { request } from 'express'
import * as taskController from '../controllers/task.js'
import requireAuthorization from '../middlewares/requireAuthorization.js'

const router = express.Router()

// router.get('task/')
router
    .use(requireAuthorization)
    .get('/', taskController.getAll)
    .get('/:id' ,taskController.getById)
    .post('/', taskController.create)
    .put('/:id', taskController.updateById)
    .delete('/:id', taskController.deleteById)

export default router