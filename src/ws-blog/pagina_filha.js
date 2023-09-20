/**
 * OBJETIVOS
 * titulo
 * link da imagem
 * data publicacao
 * texto
 */

const axios = require('axios')
const cheerio = require('cheerio')

const urlFilha = 'https://www.gov.br/pt-br/noticias/financas-impostos-e-gestao-publica/2023/08/semana-de-inovacao-abre-inscricoes-para-atividades-da-edicao-de-2023'

// function coletarDataPub(link){    
    axios.get(urlFilha)
    .then(resp=>{

        let paginaHtml = resp.data
        let $ = cheerio.load(paginaHtml)

        let colunas = []
        let titulo = $('[class="documentFirstHeading"]').text()
        let img = $('img').attr('src')
        let datas = $('span[class="value"]')
        let dataPub = $(datas[0]).text()
        let dataMod = 'Não Modificado'
        if(datas.length > 1) dataMod = $(datas[1]).text()
        let texto = $('div[property="rnews:articleBody"]').text()

        let coluna = {titulo, img, dataPub, dataMod, texto}
        colunas.push(coluna)
        
        console.log(colunas)            
    });
// }