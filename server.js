import express, { urlencoded, json } from 'express'
import session from 'express-session'
import dotenv from 'dotenv';
import { connect } from 'mongoose'

import * as routes from './routes/index';

dotenv.config()

const app = express();
const port = process.env.PORT

/********** Data base connection **********/
connect(process.env.MONGO_DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false })
  .then(() => console.log('MongoDB Connected at ' + process.env.MONGO_DB_ENV))
  .catch(err => console.log(err))

/********** JSON parser middleware **********/
app.use(urlencoded({ extended: false }));
app.use(json())
routes.routesV1(app);

/********** Session initialization  middleware **********/
app.use(session({
  secret: process.env.SECRET_REQUIRED,
  cookie: { maxAge: 60000, secure: false }, // usar secure: true en produccion
  resave: false,
  saveUninitialized: false
}))

app.get('/', (req, res) => {
  console.log(req.session)
  console.log('Headers: ', req.headers)
  console.log('IP: ', req.socket.remoteAddress, req.header('x-forwarded-for'))
  if (req.session.views) {
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!')
  }
});
console.log('Time Zone: ', new Date().toString())

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`)
});