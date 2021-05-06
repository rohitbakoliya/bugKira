import React, { useEffect } from 'react';
import * as yup from 'yup';
import { Dispatch } from 'redux';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import SingleBugWrapper from './SingleBug.style';

import { fetchBugWithId } from 'store/ducks';
import { StoreState } from 'store';
import useQuery from 'hooks/useQuery';

export const addCommentSchema = yup.object().shape({
  body: yup.string().min(6).max(1000).required(),
});

export interface AuthorProps {
  name: string;
  username: string;
  id?: string;
}

const SingleBug: React.FC = () => {
  const query = useQuery();
  const dispatch = useDispatch<Dispatch>();
  const { bugId } = useParams<any>();
  const bug = useSelector((state: StoreState) => state.singlebug);
  let query_comment_id = query.get('comment_id');
  useEffect(() => {
    dispatch(fetchBugWithId(bugId)).then(() => {
      // scroll to comment
      if (!query_comment_id) return;
      let comment: any = document?.getElementById(query_comment_id as string);
      comment && window.scrollTo(0, comment.offsetTop);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bugId, query_comment_id]);
  console.log(bug);
  return (
    <SingleBugWrapper>
      <pre>{JSON.stringify(bug, undefined, 2)}</pre>
    </SingleBugWrapper>
  );
};

export default React.memo(SingleBug);