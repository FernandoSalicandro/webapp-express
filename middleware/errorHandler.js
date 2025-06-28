export default function errorHandler(err,req,res,next){

    return res.status(500).json({
        status: 'Fail',
        message: 'Qualcosa è andato storto'
    })
}