/* eslint-disable security/detect-object-injection */
import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import Joi from 'joi';
import Bug from '../models/Bug';
import { IUser } from '../models/User';
import { validateComment } from '../validators/Comment.validator';

/**
 * @desc    to get complete timeline of a bug with bugId
 * @route   GET /api/bugs/:bugId/comments
 * @access  private
 */
export const getComments = async (req: Request, res: Response) => {
  const bugId = req.params.bugId;
  try {
    const bug = await Bug.findOne({ bugId });
    if (!bug) {
      return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${bugId} Not Found` });
    }

    return res.status(httpStatus.OK).json({ data: bug.comments });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: `something went wrong while getting comments` });
  }
};

/**
 * @desc    add a comments to a specified bugId
 * @route   PATCH /api/bugs/:bugId/comments
 * @access  private
 */
export const createComment = async (req: Request, res: Response) => {
  const bugId = req.params.bugId;
  const user = req.user as IUser;
  const { error, value } = validateComment(req.body);

  if (error)
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });

  try {
    const bug = await Bug.findOne({ bugId });
    if (!bug) {
      return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${bugId} Not Found` });
    }
    const authorDetails = {
      username: user.username,
      name: user.name,
      _id: user.id,
    };
    bug.comments.push({
      body: value.body,
      author: authorDetails,
    });
    const newBug = await bug.save();

    return res
      .status(httpStatus.CREATED)
      .json({ data: newBug.comments[newBug.comments.length - 1] });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: `something went wrong while adding comments` });
  }
};

/**
 * @desc    remove a comments from specified bugId and commentId
 * @route   DELETE /api/bugs/:bugId/comments/:cid
 * @access  private
 */
export const deleteComment = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { bugId, cid } = req.params;
  try {
    const bug = await Bug.findOneAndUpdate(
      { bugId },
      {
        $pull: {
          comments: {
            _id: cid,
            'author._id': user.id,
          },
        },
      },
      { new: true, useFindAndModify: false, runValidators: true }
    ).select('comments');
    if (!bug) return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${bugId} Not Found` });

    return res.status(httpStatus.CREATED).json({ data: bug.comments });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: `Something went wrong while deleting comment #${cid}`,
    });
  }
};

/**
 * @desc    update a comments from specified bugId, commentId
 * @route   PATCH /api/bugs/:bugId/comments/:cid
 * @access  private
 */
export const updateComment = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { bugId, cid } = req.params;
  const { error, value } = validateComment(req.body);
  if (error)
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });
  try {
    const bug = await Bug.findOneAndUpdate(
      {
        bugId,
        comments: {
          $elemMatch: {
            _id: cid,
            'author._id': user.id,
          },
        },
      },
      {
        $set: {
          'comments.$.body': value.body,
          // same as: 'comments.$[body]': value.body
        },
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    ).select('comments');

    if (!bug) return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${bugId} Not Found` });

    return res
      .status(httpStatus.OK)
      .json({ data: bug.comments.filter(comment => comment.id === cid)[0] });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: `Something went wrong while editing comment #${cid}`,
    });
  }
};

/**
 * @desc    toggle a reaction from specified bugId & reaction name
 * @route   PATCH /api/bugs/:bugId/comments/:cid/reactions
 * @access  private
 */
export const toggleReaction = async (req: Request, res: Response) => {
  const { bugId, cid } = req.params;
  const { id: userId } = req.user as IUser;

  const { error, value } = Joi.object({
    emoji: Joi.string().required(),
  }).validate(req.body);

  if (error)
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ error: error.details[0].message });

  try {
    const bug = await Bug.findOne({
      bugId,
      'comments._id': cid,
    });
    if (!bug) return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${bugId} Not Found` });

    const comment = bug.comments[0];

    // find the index of matching user & emoji pair
    const index = comment.reactions.findIndex((reaction: any) => {
      const isSameReaction = reaction.emoji === value.emoji;
      const isSameId = reaction.users.includes(userId);
      return isSameId && isSameReaction;
    });
    console.log('index', index);
    if (index > -1) {
      // i.e need to remove emoji
      const indexedComment = comment.reactions[index];
      const indexOfUser = indexedComment.users.indexOf(userId);
      indexedComment.users.splice(indexOfUser, 1);
      // if users list is empty then remove this reaction
      if (indexedComment.users.length === 0) {
        comment.reactions.splice(index, 1);
      }
    } else {
      const emojiIndex = comment.reactions.findIndex((r: any) => r.emoji === value.emoji);
      console.log(emojiIndex);
      // if emoji is not present then add create new reaction for this emoji and add user in reactions.user
      if (emojiIndex === -1) {
        comment.reactions.push({ emoji: value.emoji, users: [userId] });
      } else {
        comment.reactions[emojiIndex].users.push(userId);
      }
    }
    console.log(comment);
    // save the the changes
    // const savedBug =
    await (await bug.save()).populate('comments.reactions.users', 'name username');

    return res.status(httpStatus.OK).json({ data: comment.reactions });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: `Something went wrong while updating reaction`,
    });
  }
};

/**
 * @desc    to get all reaction of a comment
 * @route   GET /api/bugs/:bugId/comments/:cid/reactions
 * @access  private
 */

export const getAllReactionsByCid = async (req: Request, res: Response) => {
  const { bugId, cid } = req.params;
  try {
    // https://stackoverflow.com/a/41354060/10629172
    const bug = await Bug.findOne(
      {
        bugId,
        'comments._id': cid,
      },
      { 'comments.$': 1 }
    );
    // .select('comments.reactions')
    // .populate('comments.reactions.users', 'name username');

    if (!bug) return res.status(httpStatus.NOT_FOUND).json({ error: `Bug#${bugId} Not Found` });
    // TODO: return res based upon need
    return res.status(httpStatus.OK).json({ data: bug.comments[0].reactions });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: `Something went wrong while fetching reaction`,
    });
  }
};
