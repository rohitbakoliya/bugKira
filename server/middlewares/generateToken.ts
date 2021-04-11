import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export const generateToken = (req: Request, res: Response) => {
  const user = req.user as IUser;
  const SECRET = process.env.JWT_TOKEN_SECRET!;
  // create jwt token
  const token = jwt.sign(
    {
      id: user.id,
      isVerified: user.isVerified,
      provider: user.provider,
      username: user.username,
      name: user.name,
      email: user.email,
      googleId: user.googleId,
    },
    SECRET,
    { expiresIn: '2h' }
  );

  res
    .status(httpStatus.OK)
    .cookie('jwt', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true })
    .send(OAuthSuccessPage);
};

const OAuthSuccessPage = `
<html>
  <head>
    <title>BugKira</title>
  </head>
  <body>
    <p>Successfully Authorized!</p>
    <script>
      window.onload = window.close();
        let originUrl = window.location.origin;
        if (window.location.hostname === 'localhost') {
          originUrl = 'http://localhost:3000'
        }
      window.opener.postMessage('success', originUrl);
    </script>
  </body>
</html>`;
