import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.id}-${file.originalname}`);
  },
});


const fileFilter = (req,file,cb)=> {
    const fileTypes = /jpeg|jpg|png|pdf/
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileTypes.test(file.mimetype)


    if(extname && mimetype){
        return cb(null, true)
    }else{
        cb(new Error("Error: Solo se permiten imagenes y PDFS"))
    }
} 

const upload = multer({
    storage: storage,
    limits: {fileSize: 1024*1024*5},
    fileFilter: fileFilter,
})

const uploadPromise = (req, res, uploadMiddleware) => {
  return new Promise((resolve, reject) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};


export {upload, uploadPromise}