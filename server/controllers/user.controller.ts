import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

/**
 * @description To check authentication status
 * @route       GET /api/user/check-auth
 */

export const checkAuth = (req: Request, res: Response) => {
  if (req.user) {
    return res.status(httpStatus.OK).json({ success: true, data: req.user });
  }
  // TODO: get error from passport middleaware
  return res.status(httpStatus.BAD_REQUEST).json({ success: false, error: 'No such user exists' });
};
