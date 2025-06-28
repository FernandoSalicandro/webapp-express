import express from 'express';
import connection from './data/movies_db.js';
import router from './routers/movieRoutes.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import imagePath from './middleware/imagePath.js';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(express.static('public'));

//rotta per test

app.get('/', (req,res)=> {

 res.json({message: 'Benvenuto nella rotta base'})

})

app.use('/movies',imagePath, router)


app.use(notFound);
app.use(errorHandler);
app.listen(port, ()=>{
    console.log('server in ascolto sulla porta:', port)
})
