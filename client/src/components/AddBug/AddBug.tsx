import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { InputLarge } from '@bug-ui/Form';
import { Button } from '@bug-ui';

import AddBugSchema from './AddBugSchema';
import Editor from 'components/Editor/Editor';
import DashboardHeader from 'components/DashboardHeader';
import StyledEditor from 'components/Editor/Editor.style';
import AddBugWrapper from './AddBug.style';

import { addBug } from 'store/ducks';
import { StoreState } from 'store';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';

const AddBug: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, watch, reset, setValue } = useForm({
    mode: 'onChange',
    resolver: yupResolver(AddBugSchema),
  });
  const markdown = watch('body');

  const handleMarkdown = (e: any) => {
    setValue('body', e.target.value);
  };

  const [isLoading, error] = useSelector((state: StoreState) => [
    state.loading['bugs/ADD_BUG'],
    state.error['bugs/ADD_BUG'],
  ]);
  const onSubmit = async (data: { title: string; body: string }) => {
    dispatch(addBug(data)).then(() => {
      reset();
      setValue('body', '');
      history.push('/dashboard/bugs');
      toast.success('New bug added!');
    });
  };

  error && toast.error(error as string);
  return (
    <AddBugWrapper>
      <DashboardHeader>
        <h1>Submit new bug</h1>
      </DashboardHeader>

      <form onSubmit={handleSubmit(onSubmit as any)}>
        <StyledEditor>
          <InputLarge
            className="bug__edit-title"
            autoComplete="off"
            name="title"
            type="text"
            icon="edit"
            placeholder="Enter Title"
            errors={errors}
            inputRef={register({ required: 'Title is required' })}
          ></InputLarge>
          <Editor
            handleMarkdown={handleMarkdown}
            markdown={markdown}
            errors={errors}
            inputRef={register}
          />

          <Button
            isLoading={isLoading as boolean}
            type="submit"
            className="bug__button"
            icon="plus"
          >
            Submit
          </Button>
        </StyledEditor>
      </form>
    </AddBugWrapper>
  );
};

export default AddBug;
