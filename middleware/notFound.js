export default function notFound(req,res,next){

    res.status(404).json({status: 'fail', message: 'Route not found'})

}