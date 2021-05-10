import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Avatar, Dropdown, Flex, Twemoji } from '@bug-ui';
import { copyToClipboard, timeAgo } from 'utils';

import { AuthorProps } from 'pages/SingleBug/SingleBug';
import {
  addOrRemoveReacts,
  addOrRemoveReactsComment,
  COMMENT_REACTIONS_OPTIMISTIC,
} from 'store/ducks/single-bug';
import { StoreState } from 'store';
import { ReactionsWrapper, ReactionType } from './Reactions';
import toast from 'react-hot-toast';

const REACTIONS: { emoji: string }[] = [
  { emoji: ':+1:' },
  { emoji: ':-1:' },
  { emoji: ':heart:' },
  { emoji: ':tada:' },
  { emoji: ':smile:' },
  { emoji: ':confused:' },
];

const SmileAddIcon = ({ handleClick }: any) => (
  <Flex nowrap onClick={handleClick} className="add-smile-icon hover__button">
    <FontAwesomeIcon icon="smile" />
    <sup>
      <FontAwesomeIcon icon="plus" />
    </sup>
  </Flex>
);

const ReactionsDropdown: React.FC<{
  handleReaction: (e: any) => void;
  reactions: ReactionType[];
}> = React.memo(({ handleReaction, reactions }) => {
  const currentUserId: any = useSelector((state: StoreState) => state.auth.user?.id);

  return (
    <Dropdown shouldCloseOnClick>
      <Dropdown.Toggle>{toggle => <SmileAddIcon handleClick={toggle} />}</Dropdown.Toggle>
      <Dropdown.Content>
        <ReactionsWrapper nowrap align="center" justify="space-between">
          {REACTIONS?.map(reaction => {
            let isSelected = reactions?.some(
              r => r.emoji === reaction.emoji && r?.users?.find(u => u.id === currentUserId)
            );
            return (
              <span
                key={reaction.emoji}
                onClick={() => handleReaction(reaction.emoji)}
                className={`reactions ${isSelected ? 'reaction_selected' : ''}`}
              >
                <Twemoji emoji={reaction.emoji} className="reaction_emoji" />
              </span>
            );
          })}
        </ReactionsWrapper>
      </Dropdown.Content>
    </Dropdown>
  );
});

interface CommentProps {
  bugId: number | string;
  author: AuthorProps;
  date: string;
  reactions: ReactionType[];
  commentId: string;
  isAuthorOfComment: boolean;
  handleEditorState: (e: any) => void;
}
const CommentHeader: React.FC<CommentProps> = ({
  bugId,
  author,
  date,
  commentId,
  reactions,
  isAuthorOfComment,
  handleEditorState,
}) => {
  const dispatch = useDispatch();
  const currentUser: any = useSelector((state: StoreState) => state.auth.user);
  const copyCommentLink = () => {
    let fullPath = window.location.origin + window.location.pathname;
    let url = commentId ? `${fullPath}?comment_id=${commentId}` : fullPath;
    copyToClipboard(url);
    toast.success('Link copied!');
  };

  const handleReaction = (emoji: string) => {
    let userData = {
      username: currentUser.username,
      name: currentUser.name,
      id: currentUser.id,
    };
    // if commentId is missing that means its a bug.body
    if (commentId === '') {
      dispatch(addOrRemoveReacts(bugId, emoji));
    } else {
      dispatch({
        type: COMMENT_REACTIONS_OPTIMISTIC,
        payload: { commentId, userData, emoji: emoji },
      });
      dispatch(addOrRemoveReactsComment(bugId, commentId, emoji));
    }
  };

  return (
    <Flex nowrap gap="large" align="center" justify="space-between" className="comment__header">
      <Avatar width="45px" height="45px" size={45} username={author.username} />
      <span className="color--gray">
        <Link className="text--medium" to={`/profiles/${author.username}`}>
          {author.name}{' '}
        </Link>
        commented {timeAgo(date)}
      </span>

      <Flex nowrap gap="large" align="center" justify="space-between" className="comment__actions">
        <ReactionsDropdown handleReaction={handleReaction} reactions={reactions} />
        <Dropdown shouldCloseOnClick>
          <Dropdown.Toggle>
            <span className="hover__button">
              <FontAwesomeIcon icon="ellipsis-v" />
            </span>
          </Dropdown.Toggle>
          <Dropdown.Content style={{ padding: 0 }}>
            <Flex direction="column">
              <span onClick={copyCommentLink} className="comment__dropdown--item">
                Copy link
              </span>
              {isAuthorOfComment && (
                <span onClick={handleEditorState} className="comment__dropdown--item">
                  Edit Comment
                </span>
              )}
            </Flex>
          </Dropdown.Content>
        </Dropdown>
      </Flex>
    </Flex>
  );
};

export default React.memo(CommentHeader);
