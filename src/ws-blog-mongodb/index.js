const axios = require('axios')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
const blog = require('./schema-blog')

mongoose.connect('mongodb+srv://comum:%40comum123456@cluster0-aws.avy9j6m.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser:true,
    useUnifiedTopology:true
    })
    .then(result=>{
        console.log('conexão funcionando');
    })
    .catch(error=>{
        console.log(`Erro apresentado: ${error}`)
    })

function salvandoDados(dt){
    const novoDado = new blog({
        titulo:dt.titulo,
        dataPub:dt.dataPub,
        dataMod:dt.dataMod,
        link:dt.link,
        texto:dt.texto,
    })
    blog.find({'titulo':dt.titulo})
    .then(function(res){
       if(res.length===0){
            novoDado.save();
            console.log('DADOS REGISTRADOS!')
        }
        else{
            console.log('Dados já existentes!')
        }
    })
    .catch(function (err){
        console.log(err)        
    })
   
}

const url = 'https://www.gov.br/pt-br/noticias/financas-impostos-e-gestao-publica'

function extraiDados(link){

    axios.get(link)
        .then(resp=>{
            let paginaHtml = resp.data
            let $ = cheerio.load(paginaHtml)

            let titulo = $('[class="documentFirstHeading"]').text()

            let link = 'Não Informado'
            let datas = []

            try{
                link = $('img').attr('src')
            }
            catch{
                link = 'Não Informado'
            }

            if(link == null) link = 'Não Informado'

            try{
                datas = $('span[class="value"]')
            }
            catch{
                datas = []
            }

            let dataPub = 'Não Informado'
            let dataMod = 'Não Modificado'
            if(datas.length > 1){
                dataPub = $(datas[0]).text()
                dataMod = $(datas[1]).text()
            }else if(datas.length == 1){
                dataPub = $(datas[0]).text()
            }
            
            let texto = $('div[property="rnews:articleBody"]').text()

            let dados = {titulo, link, dataPub, dataMod, texto}
            salvandoDados(dados);          
    });
}

const links = axios.get(url)
    .then(resp=>{

        let paginaHtml = resp.data
        let $ = cheerio.load(paginaHtml)

        let dados = []
        $('[class="summary url"]').each((i,e)=>{
            let link = $(e).attr('href')
            dados.push(link)
        })

        return dados;
    });


async function main(){
    const lnk = await links;    
    lnk.map((i,e)=>{
        extraiDados(i)
    })
}

main();

setTimeout(()=>{
    mongoose.connection.close();
    console.log('Conexão finalizada');
}, 10000)