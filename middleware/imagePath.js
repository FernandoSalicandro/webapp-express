export default function imagePath(req,res,next){
    const path = `${req.protocol}://${req.get("host")}/img/movies_cover`;
    req.imagePath = path;
    next()
}