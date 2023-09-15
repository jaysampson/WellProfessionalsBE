const multer = require('multer')
const path = require('path')

// module.exports = multer({
//     storage: multer.diskStorage({}),
//     fileFilter:(req,file,cb)=>{
//         let ext = path.extname(file.originalname);
//         if(ext !== ".mp4" && ext !==".mkv" && ext !== ".jpeg" && ext !== ".jpg" && ext !==".png"){
//             cd(new Error ("File type is not support"), false);
//             return;
//         }
//         cb(null, true);
//     }
// })

const storage = multer.diskStorage({
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})

module.exports = upload;