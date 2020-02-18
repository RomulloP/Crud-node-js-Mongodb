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
    const {eAdmin} = require("../helpers/eAdmin")
    
    router.get('/' , eAdmin, (req , res) => {
        res.render("admin/index")
    })

    
//Categorias
    //Select com mongo sort() ordena
    router.get('/categorias' , eAdmin, (req , res) => {
        Categoria.find().sort({date: 'desc'}).then((categorias) => {
            res.render("admin/categorias" , {categorias: categorias})
        }).catch((err) => {
            req.flash("error_msg" , "Houve um erro  ao listar as categorias")
            
            
            res.redirect("/admin")
            
        })
        
    })

    router.post('/categorias/nova' , eAdmin, (req , res) => {

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
    //Select com mongo
    router.get('/categorias/edit/:id' , eAdmin, (req , res) => {
        Categoria.findOne({_id: req.params.id}).then((categoria) => {
            res.render("admin/editcategorias" , {categoria: categoria})
        }).catch((err) => {
            req.flash("error_msg" , "Essa categoria não existe")
            res.redirect("/admin/categorias")
        })
        
    })

    router.post('/categorias/edit' , eAdmin, (req , res) => {
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

    router.get('/categorias/add' , eAdmin, (req , res) => {
        res.render("admin/addcategoria")
    })

    router.post('/categorias/deletar' , eAdmin, (req , res)=>{
        Categoria.remove({_id: req.body.id}).then(() => {
            req.flash("success_msg" , "Categoria deletada com sucesso")
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash("error_msg" , "Erro ao deletar categoria")
            res.redirect('/admin/categoria')
        })
    })

//Posts
    router.get('/postagens' , eAdmin, (req , res) => {

        Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) =>{
            res.render("admin/postagens" , {postagens: postagens})
        }).catch((err) => {
            req.flash("error_msg" , "Houve um erro ao listar as postagens")
            res.redirect("/admin")
        })

        
    })

    router.get('/postagens/add' , eAdmin, (req , res) => {
        Categoria.find().then((categorias) =>{
            res.render("admin/addpostagem" , {categorias: categorias})
        }).catch((err) => {
            req.flash("error_msg" , "Houve um erro ao carregar o fomulario")
            res.redirect("/admin")
        })
        
    })

    router.post('/postagens/nova' , eAdmin, (req , res) =>{
        
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

    router.get("/postagens/edit/:id" , eAdmin, (req , res) => {
        //Busca em seguida
        Postagem.findOne({_id: req.params.id}).then((postagem) => {

            Categoria.find().then((categorias) =>{
                res.render("admin/editpostagens" , {categorias: categorias , postagem: postagem})
            }).catch((err) => {
                req.flash("error_msg" , "HOuve um erro ao listar as categorias")
                console.log(err);
                res.redirect("/admin/postagens")
                
            })

        }).catch((err) => {
            req.flash("error_msg" , "Houve um erro ao carregar o formulario de edição de postagem")
            console.log(err)
            res.redirect("/admin/postagens")
        })

        
    })

    router.post("/postagens/edit" , eAdmin, (req , res) => {

        Postagem.findOne({_id: req.body.id}).then((postagem) => {

            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.conteudo = req.body.conteudo
            postagem.descricao = req.body.descricao
            postagem.categoria = req.body.categoria

            postagem.save().then(() => {
                req.flash("success_msg" , "Postagem editada com sucesso")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                console.log(err);
                req.flash("error_msg" , "Erro interno")
                res.redirect("/admin/postagens")
            })

        }).catch((err) => {
            console.log(err);
            req.flash("error_msg" , "Houve um erro ao editar a postagem")
            res.redirect("/admin/postagens")
            
        })


    })

    router.post('/postagens/deletar' , eAdmin, (req , res)=>{
        Postagem.remove({_id: req.body.id}).then(() => {
            req.flash("success_msg" , "Postagem deletada com sucesso")
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash("error_msg" , "Erro ao deletar postagem")
            res.redirect('/admin/postagens')
        })
    })




//Exportando rotas
    module.exports = router