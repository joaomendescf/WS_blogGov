const axios = require('axios')
const cheerio = require('cheerio')
// const readline = require('readline');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });
  
 
axios.get('https://www.gov.br/pt-br/noticias/financas-impostos-e-gestao-publica')
.then(resp=>{

    let paginaHtml = resp.data
    let $ = cheerio.load(paginaHtml)

    let colunas = []
    $('[class="summary url"]').each((i,e)=>{

        let titulo = $(e).text()
        let link = $(e).attr('href')

        let coluna = {titulo, link}
        colunas.push(coluna)
    })

    // console.log(colunas)

    for(let coluna in colunas){
        // console.log(coluna['link'])
        // rl.question('===================================');
        coletarDataPub(coluna['link'])
    }
})

function coletarDataPub(link){    
    axios.get(link)
    .then(resp=>{

        let paginaHtml = resp.data
        let $ = cheerio.load(paginaHtml)

        // let colunas = []
        $('[class="documentPublished"] > span').each((i,e)=>{

            let data_pub = $(e).text()
            // let link = $(e).attr('href')

            // let coluna = {titulo, link}
            // colunas.push(coluna)
            console.log(data_pub)            
        });

    });
}