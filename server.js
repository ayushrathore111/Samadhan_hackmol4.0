import express from 'express';
import cors from 'cors';
import connect from './database/conn.js';
import router from './router/route.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
/** middlewares */
app.use(cookieParser());
// app.set('content-type', 'application/json');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.disable('x-powered-by');
// less hackers know about our stack
app.set('view engine', 'hbs');
app.use(express.static('public'));
const port = 3001;

/** HTTP GET Request */

/** api routes */
app.get('/',(req,res)=>{
    res.setHeader('Access-Control-Allow-Credentials','true');
    res.render('index');
});
app.use('/', router);
app.get('/clubs/gdsc', (req, res) => {
    res.render('clubs');
})

/** start server only when we have valid connection */
connect().then(() => {
    app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
    });
}).catch(error => {
    console.log("Invalid database connection...!");
});
