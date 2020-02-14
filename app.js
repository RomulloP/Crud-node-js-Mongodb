//Importando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser =  require('body-parser')
    const mongoose = require('mongoose')
    const app = express()
    const admin = require("./routes/admin")
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
//Configs
    //Sessão
        app.use(session({
            secret: "vrau",
            resave: true,
            saveUninitialized: true
        }))

        app.use(flash())

    //Middleware
        app.use((req , res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine' , 'handlebars')
    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect("mongodb://localhost/blogapp" , {useNewUrlParser: true }).then(() => {
            console.log("Conectado ao Mongo");
            
        }).catch((err) => {
            console.error("Erro ao se Conectar:" + err);
            
        })
    //Public 
        app.use(express.static(path.join(__dirname, "public")))
        
//Rotas
    app.get('/' , (req , res) => {
        res.send('pagina principal')
    })
    app.use('/admin' , admin)

//Outros
    const port = 8081
    app.listen(port ,  () =>{
        console.log("Servidor rodando: "+port);
        
    })