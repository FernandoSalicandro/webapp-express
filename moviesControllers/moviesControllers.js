import connection from '../data/movies_db.js';


//index 
const index = (req, res) => {
    console.log(req.imagePath)

    const sql = `
                SELECT *
                FROM movies
                `
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            const movies = results.map((curMovie)=>{
                return {
                    ...curMovie,
                    image: `${req.imagePath}/${curMovie.image}`
                };
            })

            res.json({
                data: movies,
            })
        }


    })
}

//show

const show = (req, res) => {
    const { id } = req.params;
    const sql = `
    SELECT *
    FROM movies
    WHERE movies.id = ?`

    const reviewSql = `
    SELECT *
    FROM reviews
    WHERE reviews.movie_id = ?`

    connection.query(sql, [id], (err, movieResults) => {
        if (err) { console.log(err) }
        if (movieResults.length === 0) { res.status(404).json({ err: 'Movie not found' }) } else {

            connection.query(reviewSql, [id], (err, reviewResults) => {

                res.json({
                    data: { 
                        ...movieResults[0], 
                        image: `${req.protocol}://${req.get('host')}/img/movies_cover/${movieResults[0].title}.jpg`, reviews: reviewResults }
                })

            })

        }

    })
}





export default { index, show }

