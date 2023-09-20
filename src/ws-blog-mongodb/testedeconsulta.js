const mongoose = require('mongoose')
const blog = require('./schema-blog')

const titulo = "Censo 2022 indica que o Brasil totaliza 203 milhões de habitantes"
// const titulo = "203 milhões de habitantes"

mongoose.connect('mongodb+srv://mendesnr:%40JF159730ana@cluster0-aws.avy9j6m.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser:true,
    useUnifiedTopology:true
    })
    .then(result=>{
        console.log('conexão funcionando');
    })
    .catch(error=>{
        console.log(`Erro apresentado: ${error}`)
    })

    blog.find({'titulo':titulo})
    .then(function(res){
       if(res.length===0){
            console.log('Dados nao cadastrados')
        }
        else{
            console.log('Dados CADATRADOS!!')
        }
    })
    .catch(function (err){
        console.log(err)        
    })

    setTimeout(()=>{
        mongoose.connection.close();
        console.log('Conexão finalizada');
    }, 10000)