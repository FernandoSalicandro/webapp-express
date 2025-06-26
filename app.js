import express from 'express';
import connection from './data/movies_db.js';
import router from './routers/movieRoutes.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

//rotta per test

app.get('/', (req,res)=> {

return res.json({message: 'Benvenuto nella rotta base'})

})

app.use('/movies', router)












app.listen(port, ()=>{
    console.log('server in ascolto sulla porta:', port)
})
