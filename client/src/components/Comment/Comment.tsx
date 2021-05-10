import React, { useState, useCallback } from 'react';
import RM from 'react-markdown';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';

import { getRefsOrMentions, renderMarkdown } from 'utils';
import { AuthorProps, addCommentSchema as CommentSchema } from 'pages/SingleBug/SingleBug';

import { Button, ButtonGroup } from '@bug-ui';

import CodeBlock from 'components/Editor/CodeBlock';
import Editor from 'components/Editor/Editor';
import StyledEditor from 'components/Editor/Editor.style';
import StyledComment from './Comment.style';

import { editComment, updateBug, addReferences, mentionPeople } from 'store/ducks';
import { StoreState } from 'store';
import CommentHeader from './CommentHeader';
import Reactions from './Reactions';
import toast from 'react-hot-toast';

const ReactMarkdown = React.memo(RM);

interface CommentProps {
  author: AuthorProps;
  date: string;
  body: string;
  bugId: number | string;
  commentId: string;
  isSelected?: boolean;
  reactions?: any;
}
const Comment: React.FC<CommentProps> = ({
  author,
  date,
  body,
  bugId,
  commentId,
  isSelected,
  reactions,
}) => {
  const dispatch = useDispatch<any>();
  const userId = useSelector((state: StoreState) => state.auth.user?.id);
  const [isEditing, setIsEditing] = useState(false);

  const { watch, register, handleSubmit, setValue, errors: formErrors } = useForm({
    resolver: yupResolver(CommentSchema),
  });

  const markdown = watch('body', body);
  const handleMarkdown = (e: any) => {
    setValue('body', e.target.value);
  };

  // using || to get the states of both comment editing & bug updating
  const [isEditingPending, editingError] = useSelector(({ loading, error }: StoreState) => [
    loading['singlebug/EDIT_COMMENT'] || loading['singlebug/UPDATE_BUG'],
    error['singlebug/EDIT_COMMENT'] || error['singlebug/UPDATE_BUG'],
  ]);

  const handleEditorState = useCallback(
    (e: any) => {
      e.preventDefault();
      setValue('body', '');
      setIsEditing(!isEditing);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEditing]
  );

  const onSubmit = (formData: any) => {
    if (commentId === '') {
      // update the bug's body
      dispatch(updateBug(bugId, formData)).then(() => {
        setIsEditing(!isEditing);
      });
    } else {
      // update the comment
      dispatch(editComment(bugId, commentId, formData)).then(() => {
        setIsEditing(!isEditing);
      });
    }

    const references = getRefsOrMentions(markdown, '#');
    const mentions = getRefsOrMentions(markdown, '@');
    references.length && dispatch(addReferences(bugId, references));
    mentions.length && dispatch(mentionPeople(bugId, mentions));
  };

  const isAuthorOfComment = userId === author.id;
  const showCommentEditor = isEditing && isAuthorOfComment;

  editingError && toast.error(editingError as string);
  return (
    <StyledComment id={commentId} isSelected={isSelected} isCommentEditorOpen={showCommentEditor}>
      {showCommentEditor ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <StyledEditor>
            <Editor
              markdown={markdown}
              handleMarkdown={handleMarkdown}
              errors={formErrors}
              inputRef={register}
            />
            <ButtonGroup gap="medium">
              <Button variant="danger" icon="times" size="small" onClick={handleEditorState}>
                Cancel
              </Button>
              <Button
                icon="edit"
                size="small"
                type="submit"
                isLoading={isEditingPending as boolean}
              >
                Update
              </Button>
            </ButtonGroup>
          </StyledEditor>
        </form>
      ) : (
        <>
          <CommentHeader
            bugId={bugId}
            date={date}
            author={author}
            reactions={reactions}
            commentId={commentId}
            handleEditorState={handleEditorState}
            isAuthorOfComment={isAuthorOfComment}
          />

          <ReactMarkdown
            className="markdown-preview"
            children={renderMarkdown(body)}
            components={CodeBlock as any}
          />
          <Reactions reactions={reactions} />
        </>
      )}
    </StyledComment>
  );
};

export default React.memo(Comment);
