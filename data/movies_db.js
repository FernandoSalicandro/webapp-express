import mysql from 'mysql2';

const connection = mysql.createConnection(
    {
        host : 'localhost',
        user : 'root',
        password : 'Marialapazza.112',
        database : 'movies_db'
    }
)

connection.connect((err) => {
    if (err) {
        console.error('Errore di connessione al DB:', err.message);
        return;
    }
    console.log('Connesso correttamente al Db movies_db');
});



export default connection;