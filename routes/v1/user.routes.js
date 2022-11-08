import { Router } from 'express';
import * as UserController from '../../controllers/v1/user.controller';


/***** Initializing router *****/
const userRouter = Router()

const midSec = (req,res,next)=>{ console.log('Middleware de seguridad'); next();}; 
/***** Creating User Routes *****/
userRouter.get('/user/hola',(req,res)=>{res.sendStatus(200)})
userRouter.post('/login', UserController.userLogin)
userRouter.post('/register', UserController.userRegister)
userRouter.get('/user', midSec, UserController.getUser)
userRouter.get('/user/edit', midSec, UserController.userUpdate)
userRouter.post('/user/delete', midSec, UserController.userDelete)

export default userRouter;