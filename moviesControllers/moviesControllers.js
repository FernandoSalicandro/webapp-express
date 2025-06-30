import connection from '../data/movies_db.js';


//index 
const index = (req, res) => {
    const search = req.query.search?.toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const elementPerPage = 4;
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


export default { index, show }

