if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://admin:adm123@cluster0-zc39f.mongodb.net/test?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}