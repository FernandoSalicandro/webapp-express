import multer from 'multer';
import slugify from 'slugify';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/movies_cover')
    },
    filename: (req, file, cb) => {
        const { title } = req.body;
        const slug = slugify(title, {
            lower: true,
            strict: true,
        });
        const extension = path.extname(file.originalname);
        cb(null, slug + extension)
    }
});

export const upload = multer({ storage });