const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

dotenv.config({path: './.env'})

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public')); //No need of public folder for html
//parse url-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}));
//parse JSON bodies (as sent by API clients)
app.use(express.json());
//for serup session
app.use(session({
    secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    console.log(req.originalUrl);
    //console.log( __dirname )
    next();
})

let auth = (req, res, next)=>{
    if(!req.session.username && !req.originalUrl.startsWith('/logs')){
        console.log(req.session);
        res.render('logs/login', {error: "login first", url: req.originalUrl})
    }else{
        next();
    }
}

var user = {
    name: "Pranavan",
    img:"/img/avatars/avatar.jpg"
}

app.get('/', auth, (req, res)=>{
    res.render('index', {user});
});
app.use('/auth', require('./routes/auth'));
app.use('/data', auth, require('./routes/data'));
app.use('/pages', auth, require('./routes/pages'));

app.listen(3000, ()=>{
    console.log("Server stated on port 3000");
});