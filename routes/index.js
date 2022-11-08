import userRouter from './v1/user.routes';

export const routesV1 = (app)=> {
    app.use('/api/v1/',[
        userRouter
    ]);
};

