import { Request, Response } from 'express';
import Joi from 'joi';
import httpStatus from 'http-status-codes';
import { IUser, User } from '../models/User';
import Notification from '../models/Notification';
import Bug from '../models/Bug';
import { NOTIFY_TYPES } from '../utils';

export const getNotifications = async (req: Request, res: Response) => {
  const MAX_ITEMS = 10;
  const page = req.query.page ? parseInt(req.query.page as string) - 1 : 0;

  const notifications = await Notification.find({})
    .sort({ createdAt: -1 })
    .populate('byUser', 'username')
    .populate('onBug', 'title bugId')
    .populate('fromBug ', 'title bugId')
    .populate('references ', 'title bugId');

  const filtered = notifications.filter((notify: any) => {
    if (notify.type === NOTIFY_TYPES.MENTIONED) {
      return notify.notificationTo.includes((req.user as IUser).id);
    } else {
      return notify;
    }
  });

  return res.status(httpStatus.NOT_FOUND).json({
    totalDocs: filtered.length,
    totalPages: Math.floor(filtered.length / MAX_ITEMS),
    data: filtered.slice(MAX_ITEMS * page, MAX_ITEMS * page + MAX_ITEMS),
  });
};

/**
 * @desc    add a notification on mentioning user
 * @route   POST /api/notifications/mentions/:bugId
 * @access  private
 */
export const mentionPeople = async (req: Request, res: Response) => {
  const { error, value } = Joi.object({
    mentions: Joi.array().items(Joi.string()).required(),
  }).validate(req.body);

  if (error) {
    return res.status(httpStatus.NOT_FOUND).json({ error: error.details[0].message });
  }

  const usersIds = await User.find({
    username: {
      $in: [...value.mentions],
    },
  }).select('_id');

  const bug = await Bug.findOne({ bugId: req.params.bugId });
  if (!bug)
    return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${req.params.bugId} Not Found` });

  // send notifications
  const notification = new Notification({
    type: NOTIFY_TYPES.MENTIONED,
    byUser: (req.user as IUser).id,
    onBug: bug._id,
    mentions: [...value.mentions],
    notificationTo: usersIds.map(v => v._id),
  });
  await notification.save();

  return res.status(httpStatus.OK).json({ message: notification });
};
