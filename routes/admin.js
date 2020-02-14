//Rotas do painel administrativo
    const express = require('express')
    //router responsavel pelas rotas
    const router = express.Router()
    const moongose = require('mongoose')
    //Carregando models
    require("../models/Categoria")
    const Categoria = moongose.model("categorias")
    require("../models/Postagem")
    const Postagem = moongose.model("postagens")
    
    router.get('/' , (req , res) => {
        res.render("admin/index")
    })

    
//Categorias
    router.get('/categorias' , (req , res) => {
        Categoria.find().sort({date: 'desc'}).then((categorias) => {
            res.render("admin/categorias" , {categorias: categorias})
        }).catch((err) => {
            req.flash("error_msg" , "Houve um erro  ao listar as categorias")
            
            
            res.redirect("/admin")
            
        })
        
    })

    router.post('/categorias/nova' , (req , res) => {

        var erros = []

        if(!req.body.nome ||typeof req.body.nome == undefined || req.body.nome == null ){
            erros.push({texto: "Nome Invalido"})
        }

        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            erros.push({texto: "Slug Invalido" })
        }

        if(req.body.nome.length < 2){
            erros.push({texto: "Nome da Categoria Muito pequeno"})
        }

        if(erros.length > 0){
            res.render("admin/addcategoria" , {erros: erros})
        }else{
            const novaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            }
    
            new Categoria(novaCategoria).save().then(() => {
                req.flash("success_msg" , "Categoria criada com sucesso")
                res.redirect("/admin/categorias")
            }).catch((err) => {
                req.flash("error_msg" , "Erro ao cadatrar categoria , tente novamente")
                res.redirect("/admin")
            })  
        }

       
    })

    router.get('/categorias/edit/:id' , (req , res) => {
        Categoria.findOne({_id: req.params.id}).then((categoria) => {
            res.render("admin/editcategorias" , {categoria: categoria})
        }).catch((err) => {
            req.flash("error_msg" , "Essa categoria não existe")
            res.redirect("/admin/categorias")
        })
        
    })

    router.post('/categorias/edit' , (req , res) => {
        var erros = []

        if(!req.body.nome ||typeof req.body.nome == undefined || req.body.nome == null ){
            erros.push({texto: "Nome Invalido"})
        }

        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
            erros.push({texto: "Slug Invalido" })
        }

        if(req.body.nome.length < 2){
            erros.push({texto: "Nome da Categoria Muito pequeno"})
        }

        if(erros.length > 0){
            res.render("admin/editcategoria" , {erros: erros})
        }else{
            Categoria.findOne({_id: req.body.id}).then((categoria) => {

                categoria.nome = req.body.nome
                categoria.slug = req.body.slug

                categoria.save().then(() => {
                    req.flash("success_msg" , "Categoria Editada")
                    res.redirect("/admin/categorias")
                }).catch((err) => {
                    req.flash("error_msg" , "Erro ao editar categoria")
                    res.redirect("/admin/categorias")
                })

            }).catch((err) => {
                req.flash("error_msg" , "Houve um erro na edição de categoria")
                res.redirect('/admin/categorias')
            })
        }
    })

    router.get('/categorias/add' , (req , res) => {
        res.render("admin/addcategoria")
    })

    router.post('/categorias/deletar' , (req , res)=>{
        Categoria.remove({_id: req.body.id}).then(() => {
            req.flash("success_msg" , "Categoria deletada com sucesso")
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash("error_msg" , "Erro ao deletar categoria")
            res.redirect('/admin/categoria')
        })
    })

//Posts
    router.get('/postagens' , (req , res) => {

        Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) =>{
            res.render("admin/postagens" , {postagens: postagens})
        }).catch((err) => {
            req.flash("error_msg" , "Houve um erro ao listar as postagens")
            res.redirect("/admin")
        })

        
    })

    router.get('/postagens/add' , (req , res) => {
        Categoria.find().then((categorias) =>{
            res.render("admin/addpostagem" , {categorias: categorias})
        }).catch((err) => {
            req.flash("error_msg" , "Houve um erro ao carregar o fomulario")
            res.redirect("/admin")
        })
        
    })

    router.post('/postagens/nova' , (req , res) =>{
        
        var erros = []

        if(req.body.categoria == 0){
            erros.push({texto: "Categoria Invalida , registre um categoria"})
        }

        if(erros.length > 0){
            res.render("admin/addpostagem" , {erros: erros})
        }else{
            const novaPostagem = {
                titulo: req.body.titulo,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria,
                slug: req.body.slug
            }

            new Postagem(novaPostagem).save().then(() => {
                req.flash("success_msg" ,  "Postagem Criada com sucesso")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                req.flash("error_msg" , "Houve um erro durante o salvamento da postagem")
                console.log(err);
                res.redirect("/admin/postagens")
            })
        }
    })




//Exportando rotas
    module.exports = router