
class AppError extends Error {
    constructor(message, statusCode) {
      super(message); 
      this.statusCode = statusCode; 
      this.isOperational = true; 
  
      Error.captureStackTrace(this, this.constructor); 
    }
  }

const errorHandler = (err, req, res, next) => {
    console.error(err); 
  
    const statusCode = err.statusCode || 500; 
    const message = err.isOperational ? err.message : 'Something went wrong!'; 
  
   
    res.status(statusCode).json({
      success: false,
      message, 
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), 
    });
  };
  
  export { errorHandler , AppError };
  