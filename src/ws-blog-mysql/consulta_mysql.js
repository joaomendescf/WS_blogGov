const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit:10,
    host: 'localhost',
    user:'mendesnr',
    password:'159730',
    database: 'blog'
});


const consulta = (msg) =>{
    pool.getConnection(function(err, connection){
        if(err) throw err;
        connection.query('select * from `noticias` where `titulo` = ?', msg, function(error, result, fields){
            let countresult = result.length;
            
            if(countresult === 0 ) console.log('titulo nao cadastrado')
            else console.log('titulo cadastrado')
            
            if(error) throw error;
        });
    })
};

let titulo = 'Taxa de desemprego no país cai para 8%, menor índice desde 2014'
consulta(titulo)