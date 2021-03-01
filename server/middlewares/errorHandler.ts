import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';

// ? https://expressjs.com/en/guide/error-handling.html

const errorHandler = (err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Something broke!');
  } else if (err instanceof multer.MulterError) {
    // fileUpload error handling
    console.log(err.field);
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        res.status(httpStatus.REQUEST_TOO_LONG).json({ error: 'File size is too large' });
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        res.status(httpStatus.UNSUPPORTED_MEDIA_TYPE).json({
          error: 'Invalid File format. must be PNG,JPG,JPEG',
        });
        break;
      default:
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          error: 'Something went wrong while uploading file',
        });
        break;
    }
  } else next();
};
export default errorHandler;
