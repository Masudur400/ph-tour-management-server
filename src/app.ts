
 import express, { Request, Response } from 'express' 
import cors from 'cors'
import { router } from './app/routes' 
import { globalErrorHandler } from './app/middlewares/globalErrorHandelar'
import notFound from './app/middlewares/notFound'
import cookieParser from 'cookie-parser'





const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors())



app.use('/api/v1', router)


app.get('/',(req:Request, res : Response)=>{
res.status(200).json({
    message: 'welcome to tour management system backend'
})
})


 app.use(globalErrorHandler)
 app.use(notFound)

export default app;