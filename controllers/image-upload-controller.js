const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/app-error');
const catchError = require('../utils/catch-error')

const multerStorage = multer.memoryStorage();
const fileFilter = (req,file,cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null,true);
    } else {
        cb(new AppError('This is not an image file' , 400) , false);
    }
}
const upload = multer({storage:multerStorage,fileFilter:fileFilter});

exports.uploadImage = upload.fields([{name:'image' , maxCount:1}]);
exports.resizeImage = catchError(async(req , res , next) => {
    if(!req.files) {
        return next(new AppError('File not found' , 400));
    }
    const {height , width} = req.query;
    console.log(height);
    const folderName = await req.params.name;
    const name = await req.files.image[0].originalname.toLowerCase().split(' ').join('-');
    req.files.image[0].originalname = await `image-${Date.now()}-${name}`;
    await sharp(req.files.image[0].buffer)
          .resize(width,height) //width , height
          .toFormat('jpeg')
          .jpeg({quality:90})
          .toFile(`assets/${folderName}/${req.files.image[0].originalname}`);
          next();
});

exports.sendImageServerUrl = catchError(async(req , res , next) => {
    const folderName = await req.params.name;
    const baseUrl = await req.protocol + '://' + req.get('host');
    const imageServerUrl = await baseUrl+'/'+folderName+'/'+req.files.image[0].originalname;
    res.status(201).json({
        status:'Success',
        data:imageServerUrl
    });
})