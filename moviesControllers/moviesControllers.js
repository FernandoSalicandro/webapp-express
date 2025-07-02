import connection from '../data/movies_db.js';
import slugify from 'slugify';


//index 
const index = (req, res) => {
    const search = req.query.search?.toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const elementPerPage = 10;
    const offset = elementPerPage * (page - 1);

    let sql = `SELECT * FROM movies`;
    const params = [];

    if (search) {
        sql += ` WHERE LOWER(title) LIKE ?`;
        params.push(`%${search}%`);
    }

    sql += ` LIMIT ?, ?`;
    params.push(offset, elementPerPage);

    connection.query(sql, params, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Database error' });
        }

        const movies = results.map((curMovie) => {
            return {
                ...curMovie,
                image: `${req.imagePath}/${curMovie.image}`
            };
        });

        res.json({ data: movies });
    });
};


//show
const show = (req, res) => {
    const { slug } = req.params;
    const sql = `
    SELECT *
    FROM movies
    WHERE movies.slug = ?`

    const reviewSql = `
    SELECT *
    FROM reviews
    WHERE reviews.movie_id = ?`

    connection.query(sql, [slug], (err, movieResults) => {
        if (err) { console.log(err) }
        if (movieResults.length === 0) { res.status(404).json({ err: 'Movie not found' }) } else {

            connection.query(reviewSql, [movieResults[0].id], (err, reviewResults) => {

                res.json({
                    data: {
                        ...movieResults[0],
                        image: `${req.protocol}://${req.get('host')}/img/movies_cover/${movieResults[0].image}`, reviews: reviewResults
                    }
                })

            })

        }

    })
}
//store movie

const store = (req, res, next) => {
    console.log("Creo film");

    // Prendiamo i dati del film dal body della richiesta
    const { title, director, genre, release_year, abstract } = req.body;
    console.log(title, director, genre, release_year, abstract);

    // Creiamo lo slug dal titolo
    const slug = slugify(title, {
        lower: true,
        strict: true,
    });

    const image = req.file?.filename || null;

    // Scriviamo la prepared statement query
    const sql = `
        INSERT INTO movies (slug, title, director, genre, release_year, abstract, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    console.log(sql);

    // Eseguiamo la query
    connection.query(
        sql, 
        [slug, title, director, genre, release_year, abstract, image], 
        (err, results) => {
            // Se c'è errore lo gestiamo
            if (err) {
                return next(new Error(err));
            }

            // Invio la risposta con il codice 201 e id e slug
            return res.status(201).json({
                id: results.insertId,
                slug,
                image
            });
        }
    );
};

//store review
const storeReview = (req, res) => {
    const { movieId } = req.params;
    const { name, vote, text } = req.body;

    if (!name || !vote) {
        return res.status(400).json({ erro: 'Nome e Voto sono campi obbligatori' })
    }

    const sql = `INSERT INTO reviews (movie_id, name, vote, text)
                 VALUES (?,?,?,?);
                 `;

    connection.query(sql, [movieId, name, vote, text], (err, results) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: 'Errore nel database' })
        } 
        res.status(201).json({
        message: 'Review aggiunta con successo',
        data: {
            id: results.insertId,
            movie_id : movieId,
            name,
            vote,
            text,
            created_at: new Date()
        }
    })
    })

}

export default { index, show, storeReview, store }



