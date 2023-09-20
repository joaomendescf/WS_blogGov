const axios = require('axios')
const cheerio = require('cheerio')

const urlPai = 'https://www.gov.br/pt-br/noticias/financas-impostos-e-gestao-publica'

function extraiDados(link){

    axios.get(link)
        .then(resp=>{
            let paginaHtml = resp.data
            let $ = cheerio.load(paginaHtml)

            let titulo = $('[class="documentFirstHeading"]').text()
            let img = $('img').attr('src')
            let datas = $('span[class="value"]')
            let dataPub = $(datas[0]).text()
            let dataMod = 'Não Modificado'
            if(datas.length > 1) dataMod = $(datas[1]).text()
            let texto = $('div[property="rnews:articleBody"]').text()

            let dados = {titulo, img, dataPub, dataMod, texto}
           
            console.log(dados)            
    });
}

const links = axios.get(urlPai)
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