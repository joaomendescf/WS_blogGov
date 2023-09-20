const mongoose = require('mongoose')

const blog = mongoose.model(
    'blog',
    mongoose.Schema({
        titulo:String,
        link:String, 
        dataPub:String,
        dataMod:String, 
        texto:String
    })
);

module.exports = blog;