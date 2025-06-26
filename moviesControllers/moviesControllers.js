import express from 'express';
import connection from '../data/movies_db.js';

//index 
const index = (req, res) => {

    const sql = `
                SELECT *
                FROM movies
                `
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ err: 'Dq query failed' });
        if (results.length === 0) return res.status(404).json({ err: 'Movie not found' });
        return res.json(results)
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
        if (err) return res.status(500).json({ err: 'Failed db request' });
        if (movieResults.length === 0) { res.status(404).json({ err: 'Movie not found' }) } else {
            connection.query(reviewSql, [id], (err, reviewResults) => {

                res.json({
                    ...movieResults[0],
                    reviews : reviewResults
                })

            })

        }

    })
}





export default { index, show }