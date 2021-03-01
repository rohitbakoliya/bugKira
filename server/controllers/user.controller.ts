import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { CLIENT_URL, SERVER_URL } from '../config/siteUrls';
import { User, validateUserLogin } from '../models/User';

/**
 * @description To check authentication status
 * @route       GET /api/user/check-auth
 */

export const checkAuth = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({ data: req.user });
};

/**
 * @description to logout current user
 * @route       GET /api/user/logout
 */
export const logout = (req: Request, res: Response) => {
  req.logOut();
  res.status(httpStatus.OK).clearCookie('jwt').json({ data: 'logged out successfully!' });
};

/**
 * @description to signup user
 * @route       POST /api/user/signup
 */
export const signup = async (req: Request, res: Response) => {
  const { body } = req;
  // * as profile is required for now
  if (!req.file) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: 'Please Select An Image' });
  }
  // 1) save user in db
  // 2) create email verification token
  // TODO: 3) crete verification email and send email
  try {
    // create new user for sign up
    // as all possible conflicts already checked in the `signupErrorHandler` middleware
    const newUser = new User({
      name: body.name,
      username: body.username,
      provider: ['local'],
      email: body.email,
      password: body.password,
      avatar: req.file.id,
      avatarUrl: `${CLIENT_URL}/api/user/${body.username}/avatar/raw`,
    });
    const savedUser = await newUser.save();
    // create verification token using jwt
    const SECRET = process.env.JWT_TOKEN_SECRET!;
    const vericationToken = jwt.sign(
      {
        id: savedUser.id,
      },
      SECRET,
      { expiresIn: '2h' }
    );
    // create verification link and send email
    const verificationLink = `${SERVER_URL}/api/user/verify-email?token=${vericationToken}`;
    console.log(verificationLink);

    const data = {
      isVerified: savedUser.isVerified,
      avatarUrl: savedUser.avatarUrl,
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      name: savedUser.name,
    };
    return res.status(httpStatus.CREATED).json({ data });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'something went wrong' });
  }
};

/**
 * @description to signup user
 * @route       POST /api/user/signup
 */
export const login = async (req: Request, res: Response) => {
  const isEmail = /^.*(@).*$/.test(req.body.uoe);
  const { error, value } = validateUserLogin(req.body, isEmail);
  if (error) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });
  }
  try {
    // check if user exist
    let user: any = {};
    if (isEmail) {
      const findUser = await User.findOne({ email: value.uoe });
      if (!findUser)
        return res.status(httpStatus.NOT_FOUND).json({ error: 'Email does not exists' });

      user = findUser;
    } else {
      const findUser = await User.findOne({ username: value.uoe });
      if (!findUser)
        return res.status(httpStatus.NOT_FOUND).json({ error: 'Username does not exists' });

      user = findUser;
    }

    // make sure email is verified
    // TODO: uncomment after adding email verication code
    // if (!user.isVerified)
    //   return res.status(httpStatus.FORBIDDEN).json({ error: 'Email not verified' });

    // user only signed up with google
    if (!user.password || !user.provider.includes('local')) {
      return res.status(httpStatus.NOT_FOUND).json({
        error: 'Unknown auth method, Try logging in with Google',
      });
    }

    // Check/Compares password
    const validPassword = await user.isValidPassword(value.password);
    if (!validPassword)
      return res.status(httpStatus.FORBIDDEN).json({ error: 'Password is incorrect' });

    // valid user so create jwt token
    const token = jwt.sign(
      {
        isVerified: user.isVerified,
        username: user.username,
        provider: user.provider,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        id: user.id,
      },
      process.env.JWT_TOKEN_SECRET!,
      { expiresIn: '2h' }
    );

    return res
      .status(httpStatus.OK)
      .cookie('jwt', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true })
      .send({
        data: {
          isVerified: user.isVerified,
          username: user.username,
          provider: user.provider,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          id: user.id,
        },
      });
  } catch (err) {
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'something went wrong' });
  }
};

/**
 * @description for email verification
 * @route       GET /api/user/verify-email?token=token
 */
export const verifyEmail = async (req: Request, res: Response) => {
  // IMPROVE: send email verification message to make toast
  try {
    const verificationToken = req.query.token as string;
    if (!verificationToken)
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: `Email verification link is broken` });

    const decoded = jwt.verify(verificationToken, process.env.JWT_TOKEN_SECRET!);

    const id = (decoded as any).id;
    const user = await User.findById(id);
    // find user based upon token
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: `Unable to find user associated with your email` });
    }
    if (user.isVerified)
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'Email is already verified' });

    // now verify user account
    user.isVerified = true;
    await user.save();

    // if everything is good
    const token = jwt.sign(
      {
        isVerified: user.isVerified,
        username: user.username,
        provider: user.provider,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        id: user.id,
      },
      process.env.JWT_TOKEN_SECRET!,
      { expiresIn: '2h' }
    );

    return res
      .status(httpStatus.OK)
      .cookie('jwt', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true })
      .redirect(CLIENT_URL);
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      if (err.message === 'jwt expired')
        return res.status(httpStatus.BAD_REQUEST).json({ error: `Verification link expired` });
      else
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ error: `Invalid email verification link` });
    }
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: `something went wront while verifying your email` });
  }
};
