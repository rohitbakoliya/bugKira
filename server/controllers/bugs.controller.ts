/* eslint-disable security/detect-object-injection */
import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import Joi from 'joi';
import Bug, { TLabels } from '../models/Bug';
import Notification from '../models/Notification';
import { IUser } from '../models/User';
import { NOTIFY_TYPES } from '../utils';
import { validateBug, validateLabels, validateReferences } from '../validators/Bug.validators';

/**
 * @desc    get all bugs
 * @route   GET /api/bugs
 * @access  private
 */
export const getAllBugs = async (_req: Request, res: Response) => {
  try {
    const bugs = await Bug.find();
    if (!bugs) {
      return res.status(httpStatus.NO_CONTENT).json({ error: 'No bugs created yet!' });
    }
    return res.status(httpStatus.OK).json({ data: bugs });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `something went wrong` });
  }
};

/**
 * @desc    get bugs suggestions
 * @route   GET /api/bugs/suggestions
 * @access  private
 * @returns `bugId, title`
 */
export const getSuggestions = async (_req: Request, res: Response) => {
  try {
    const bugs = await Bug.find().select('bugId title');
    if (!bugs) {
      return res.status(httpStatus.NO_CONTENT).json({ error: 'No bugs created yet!' });
    }
    return res.status(httpStatus.OK).json({ data: bugs });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `something went wrong` });
  }
};

/**
 * @desc    get bug by bugId
 * @route   GET /api/bugs/:bugId
 * @access  private
 */
export const getBugById = async (req: Request, res: Response) => {
  const bugId = req.params.bugId;
  try {
    const bug = await Bug.findOne({ bugId })
      .populate('reactions.users', 'name username')
      .populate('comments.reactions.users', 'name username');
    if (!bug) return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${bugId} Not Found` });

    return res.status(httpStatus.OK).json({ data: bug });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `something went wrong` });
  }
};

/**
 * @desc    to create new bug
 * @route   POST /api/bugs/
 * @access  private
 */
export const createBug = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { error, value } = validateBug(req.body);
  if (error) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });
  }
  try {
    const authorDetails = {
      _id: user.id,
      username: user.username,
      name: user.name,
    };
    const bug = new Bug({ ...value, author: authorDetails });
    const savedBug = await bug.save();

    // send notifications
    const notification = new Notification({
      type: NOTIFY_TYPES.NEW_BUG,
      byUser: (req.user as IUser).id,
      onBug: savedBug._id,
      notificationTo: [],
    });
    await notification.save();

    return res.status(httpStatus.CREATED).json({ data: savedBug });
  } catch (err) {
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `something went wrong` });
  }
};

/**
 * @desc    to update a bug with bugId
 * @route   PATCH /api/bugs/:bugId
 * @access  private
 */
export const updateBug = async (req: Request, res: Response) => {
  const bugId = req.params.bugId;
  const userId = (req.user as IUser).id;
  const schema = Joi.object({
    title: Joi.string().min(6).max(100).required(),
    body: Joi.string().min(6).max(1000).required(),
  });
  const { value, error } = schema.validate(req.body);
  if (error) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });
  }
  try {
    const bug = await Bug.findOneAndUpdate(
      {
        bugId,
        'author._id': { $eq: userId }, // only user who created bug, can update
      },
      value,
      { new: true } // inforce mongo to return updated bug
    );

    if (!bug) return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${bugId} Not Found` });

    return res.status(httpStatus.OK).json({ data: bug });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: `something went wrong while updating bug` });
  }
};

/**
 * @desc    to add a new labels
 * @route   PATCH /api/bugs/:bugId/labels/:name
 * @access  private
 */
export const addLabels = async (req: Request, res: Response) => {
  const bugId = req.params.bugId;
  const labelName = req.params.name as TLabels;

  try {
    const bug = await Bug.findOneAndUpdate(
      { bugId },
      { $addToSet: { labels: labelName } },
      { new: true, runValidators: true }
    );

    if (!bug) {
      return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${bugId} Not Found` });
    }

    return res.status(httpStatus.OK).json({ data: bug });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Something went wrong while adding new label' });
  }
};

/**
 * @desc    to delete a label
 * @route   DELETE /api/bugs/:bugId/labels/:name
 * @access  private
 */
export const deleteLabel = async (req: Request, res: Response) => {
  const bugId = req.params.bugId;
  const labelName = req.params.name as TLabels;

  try {
    const bug = await Bug.findOneAndUpdate(
      { bugId },
      { $pull: { labels: labelName } },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    if (!bug) {
      return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${bugId} Not Found` });
    }

    return res.status(httpStatus.OK).json({ data: bug });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `something went wrong` });
  }
};

/**
 * @desc    to update the whole label array
 * @route   PATCH /api/bugs/:bugId/labels
 * @access  private
 */
export const updateLabels = async (req: Request, res: Response) => {
  const bugId = req.params.bugId;
  const { error, value } = validateLabels(req.body.labels);
  if (error) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });
  }

  try {
    const bug = await Bug.findOneAndUpdate(
      { bugId },
      { $set: { labels: value } },
      { new: true, runValidators: true, useFindAndModify: false }
    );
    if (!bug) {
      return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${bugId} Not Found` });
    }

    return res.status(httpStatus.OK).json({ data: bug.labels });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: `something went wrong while updating labels` });
  }
};

/**
 * @desc    adds references to bug
 * @route   PATCH /api/bugs/:bugId/references
 * @access  private
 */
export const addReferences = async (req: Request, res: Response) => {
  const { error, value } = validateReferences(req.body);
  if (error) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });
  }

  try {
    const authorDetails = {
      _id: (req.user as IUser).id,
      username: (req.user as IUser).username,
      name: (req.user as IUser).name,
    };
    const updated = await Bug.updateMany(
      { bugId: { $in: value.references } },
      {
        $push: {
          references: {
            by: authorDetails,
            from: req.params.bugId,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updated)
      return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${req.params.bugId} Not Found` });

    // get the _id for the param.bugId to use it in Notification ref
    const bug = await Bug.findOne({ bugId: req.params.bugId });
    // get all `_id`s for `notification.references`
    const referencedIds = await Bug.find({
      bugId: {
        $in: [...value.references],
      },
    }).select('_id');
    // send notifications
    const notification = new Notification({
      type: NOTIFY_TYPES.REFERENCED,
      byUser: (req.user as IUser).id,
      fromBug: bug?._id,
      references: referencedIds.map(v => v._id),
      notificationTo: [],
    });
    await notification.save();

    return res.status(httpStatus.OK).json({ data: { modified: updated.nModified } });
  } catch (err) {
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Something went wrong while referencing bug',
    });
  }
};

/**
 * @desc    to close/open bug
 * @route   PATCH /api/bug/:bugId/[open|close]
 * @access  private
 * @param status - `boolean`
 */
export const toggleBugStatus = ({ status }: { status: boolean }) => async (
  req: Request,
  res: Response
) => {
  const bugId = req.params.bugId;
  try {
    const bug = await Bug.findOneAndUpdate(
      { bugId, isOpen: !status },
      {
        isOpen: status,
        // add this event in activities
        $push: {
          activities: {
            author: req.user,
            action: status ? 'opened' : 'closed',
          },
        },
      },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    if (!bug) {
      return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${bugId} Not Found` });
    }

    // send notifications
    const notification = new Notification({
      type: NOTIFY_TYPES.BUG_STATUS,
      byUser: (req.user as IUser).id,
      onBug: bug._id,
      bug_status: status ? 'opened' : 'closed',
      notificationTo: [],
    });
    await notification.save();

    return res.status(httpStatus.OK).json({ data: bug.activities });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `something went wrong` });
  }
};

/**
 * @desc    to get all reactions
 * @route   GET /api/bugs/:bugId/reactions
 * @access  private
 */
export const getReactions = async (req: Request, res: Response) => {
  const bugId = req.params.bugId;
  try {
    const bug = await Bug.findOne({ bugId })
      .select('reactions')
      .populate('reactions.user', 'name username');

    if (!bug) {
      return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${bugId} Not Found` });
    }

    return res.status(httpStatus.OK).json({ data: bug.reactions });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `something went wrong` });
  }
};

/**
 * @desc    toggle a reaction from specified bugId & reaction name
 * @route   PATCH /api/bugs/:bugId/reactions
 * @access  private
 */
export const addOrRemoveReaction = async (req: Request, res: Response) => {
  const bugId = req.params.bugId;
  const { id: userId } = req.user as IUser;
  const { error, value } = Joi.object({
    emoji: Joi.string().required(),
  }).validate(req.body);

  if (error) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });
  }
  try {
    const bug = await Bug.findOne({ bugId });
    if (!bug) {
      return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${bugId} Not Found` });
    }
    // find the index of matching user & emoji pair
    const index = bug.reactions.findIndex(reaction => {
      const isSameReaction = reaction.emoji === value.emoji;
      const isSameId = reaction.users.includes(userId);
      return isSameId && isSameReaction;
    });
    if (index > -1) {
      // i.e need to remove emoji
      const reactions = bug.reactions[index];
      const indexOfUser = reactions.users.indexOf(userId);
      reactions.users.splice(indexOfUser, 1);
      // if users list is empty then remove this reaction
      if (reactions.users.length === 0) {
        bug.reactions.splice(index, 1);
      }
    } else {
      const emojiIndex = bug.reactions.findIndex(r => r.emoji === value.emoji);
      // if emoji is not present then add create new reaction for this emoji and add user in reactions.user
      if (emojiIndex === -1) {
        bug.reactions.push({ emoji: value.emoji, users: [userId] });
      } else {
        bug.reactions[emojiIndex].users.push(userId);
      }
    }

    // save the the changes
    const savedBug = await (await bug.save()).populate('reactions.users', 'name username');

    return res.status(httpStatus.OK).json({ data: savedBug.reactions });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `something went wrong` });
  }
};

/**
 * TODO: create timeline endpoint
 * @desc    to get complete timeline of a bug with bugId
 * @route   GET /api/bugs/:bugId/timeline
 * @access  private
 */
