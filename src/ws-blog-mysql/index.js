const axios = require('axios')
const cheerio = require('cheerio')
const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit:30,
    host: 'localhost',
    user:'mendesnr',
    password:'159730',
    database: 'blog'
});


const salvandoDados = (dt) =>{
    pool.getConnection(function(err, connection){
        if(err) throw err;
        // console.log('aqui')
        connection.query('INSERT INTO noticias set ?', dt, function(error, result, fields){
            console.log("CADASTRANDO!");
            connection.release();

            if(error) throw error;
        })
    })
}

function gravando(linhas){
    const dados = {
        titulo:linhas.titulo,
        dataPub:linhas.dataPub,
        dataMod:linhas.dataMod,
        link:linhas.link,
        texto:linhas.texto,
    }

    pool.getConnection(function(err, connection){
        if(err) throw err;
     
        connection.query('select * from `noticias` where `titulo` = ?', dados.titulo, function(error, result, fields){
            let countresult = result.length
            
            if(countresult == 0 ){
                salvandoDados(dados);
            }else{
                console.log('titulo cadastrado');
            }
            
            if(error) throw error;
        });
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
            gravando(dados);          
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
    pool.end();
}, 10000);