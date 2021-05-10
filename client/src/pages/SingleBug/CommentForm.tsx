import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { getRefsOrMentions } from 'utils';
import { Button, Flex } from '@bug-ui';

import Editor from 'components/Editor/Editor';
import StyledEditor from 'components/Editor/Editor.style';
import CloseReopenButton from './CloseReopenButton';
import { addCommentSchema } from './SingleBug';
import { addComment, openOrCloseBug, addReferences } from 'store/ducks';
import { StoreState } from 'store';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

const CommentForm: React.FC<{ bugIsOpen: boolean }> = ({ bugIsOpen }) => {
  const dispatch = useDispatch<any>();
  const { bugId } = useParams<any>();

  const { watch, setValue, register, handleSubmit, errors: formErrors } = useForm({
    resolver: yupResolver(addCommentSchema),
  });

  const markdown = watch('body');
  const handleMarkdown = (e: any) => {
    setValue('body', e.target.value);
  };

  const onSubmit = (formData: { body: string }) => {
    dispatch(addComment(bugId, formData)).then(() => {
      const references = getRefsOrMentions(markdown, '#');
      references.length && dispatch(addReferences(bugId, references));
      setValue('body', '');
    });
  };

  const sendToggleRequest = useCallback(
    (state: string) => {
      dispatch(openOrCloseBug(bugId, state));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bugId]
  );

  const [isCommentLoading, commentError] = useSelector((state: StoreState) => [
    state.loading['singlebug/ADD_COMMENT'],
    state.error['singlebug/ADD_COMMENT'],
  ]);
  const [isToggleLoading, toggleError] = useSelector((state: StoreState) => [
    state.loading['singlebug/TOGGLE_BUG'],
    state.error['singlebug/TOGGLE_BUG'],
  ]);

  commentError && toast.error(commentError as string);
  toggleError && toast.error(toggleError as string);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <StyledEditor>
          <Editor
            markdown={markdown}
            handleMarkdown={handleMarkdown}
            errors={formErrors}
            inputRef={register}
          />
          <Flex justify="space-between" align="center">
            <CloseReopenButton
              isOpen={bugIsOpen}
              isLoading={isToggleLoading as boolean}
              onRequestToggle={sendToggleRequest}
            />
            <Button isLoading={isCommentLoading as boolean} type="submit" icon="plus">
              Comment
            </Button>
          </Flex>
        </StyledEditor>
      </form>
    </>
  );
};

export default React.memo(CommentForm);
