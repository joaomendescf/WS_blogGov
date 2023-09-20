const axios = require('axios')
const cheerio = require('cheerio')

const urlPai = 'https://www.gov.br/pt-br/noticias/financas-impostos-e-gestao-publica'

axios.get(urlPai)
.then(resp=>{

    let paginaHtml = resp.data
    let $ = cheerio.load(paginaHtml)

    let dados = []
    $('[class="summary url"]').each((i,e)=>{

        // let titulo = $(e).text()
        let link = $(e).attr('href')
        dados.push(link)
    })

    console.log(dados)

    // for(let coluna in colunas){
    //     coletarDataPub(coluna['link'])
    // }
})

