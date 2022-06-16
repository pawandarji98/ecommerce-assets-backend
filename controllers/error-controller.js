//AUTHOR: PAWAN DARJI
//CREATEDON: 1-8-2020
//LAST MODIFIED: 12-10-2020
//NAME: ERROR CONTROLLER


const AppError = require('../utils/app-error');


// when user enter wrong doc id
  const handleCastErrorDB = err=>{
      const msg = `Invalid ${err.path} is ${err.value}`;
      return new AppError(msg,400);
  }

  // duplicate Error handler
  const handleDuplicateErrorDB =(err)=>{
      console.log('enter');
    const value = err.errmsg.match(/(["'"])(\\?.)*?\1/)[0];
    const message = `Duplicate  field value :${value}. Please use another value`;
    return new AppError(message,400);
  }

  // validation Error
 const handleValidatorErrorDB = err =>{
     console.log(err);
     return new AppError('ValidatorError', err);
 }
 const handleJWTError = () =>new AppError('Invalid token. Please login again!',401);
 const handleJWTExpire = () => new AppError('Token has expired.Please login again!',401);

// AT DEVELOPMENT
const sendErrorAtDev = (err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
    });
}


// AT PRODUCTION
const sendErrorAtProd = (err,res)=>{

    // if  error is operational
    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        });
    }
    else { // if error occured due to programming error
        res.status(500).json({
            status:'error',
            message:'Something went wrong!'
        });
    }
}
module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    sendErrorAtDev(err,res);
}