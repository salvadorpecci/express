import express from 'express'
import logger from './middlewares/logger.js'
import taskRouter from './routes/task.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.js'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.use(logger)
app.use('/task', taskRouter)
app.use('/auth', userRouter)


app.get('/', (request, response) => {
    response.status(200)
    response.send({
        message: "Hola mundo"
    })
})


dotenv.config()
const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI)
    .then(() => {
        const PORT = 8080
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        })
    })
    .catch(console.error)