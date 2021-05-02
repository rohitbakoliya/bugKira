import React, { useEffect } from 'react';
import styled from 'styled-components';
import Masonry from 'react-masonry-css';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import useQuery from 'hooks/useQuery';

import { Flex, Button, Loading, Label, LabelTypes } from '@bug-ui';

import DashboardHeader from 'components/DashboardHeader';
import BugCard from 'components/BugCard/BugCard';
import { fetchBugs } from 'store/ducks';
import { StoreState } from 'store';
import { formatDate } from 'utils';

const breakpointColumns = {
  default: 3,
  1440: 3,
  1024: 2,
  768: 1,
};

const BugsWrapper = styled.section`
  margin-top: 0;
  height: 100%;
`;

const Bugs: React.FC = () => {
  let query = useQuery();
  const dispatch = useDispatch();
  const bugs = useSelector((state: StoreState) => state.bugs);
  const [isLoading, error] = useSelector((state: StoreState) => [
    state.loading['bugs/FETCH_BUGS'],
    state.error['bugs/FETCH_BUGS'],
  ]);

  useEffect(() => {
    dispatch(fetchBugs());
  }, [dispatch]);

  const renderBugs = () => {
    if (error) {
      return <> message='Something went wrong while loading the data' </>;
    }

    if (bugs.length === 0 && !isLoading) return <> empty </>;

    return (
      <>
        <Masonry
          breakpointCols={breakpointColumns}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {bugs
            ?.filter((bug: any) => {
              const labelName = query.get('label');
              const status = query.get('status');

              if (!labelName && !status) return bug.isOpen;
              // check for matching label or isOpen status
              return bug.labels.includes(labelName) || (status && !bug.isOpen);
            })
            .map((bug: any) => {
              return (
                <BugCard
                  key={bug.id}
                  title={bug.title}
                  number={bug.bugId}
                  labels={bug.labels}
                  body={bug.body}
                  isOpen={bug.isOpen}
                  date={formatDate(bug.dateOpened)}
                  author={bug.author}
                />
              );
            })}
        </Masonry>
      </>
    );
  };

  return (
    <BugsWrapper>
      <DashboardHeader>
        <Flex align="center">
          <h1>{query.get('status') ? 'Closed Bugs' : 'Track Bugs'}</h1>
          <Button as={NavLink} to="/dashboard/new-bug" style={{ marginLeft: 20 }} icon="plus">
            Add
          </Button>
        </Flex>
        {query.get('label') && (
          <>
            <br />
            <Flex align="center">
              <p>Filter: &nbsp;</p>
              <Label style={{ margin: 0 }} type={query.get('label') as LabelTypes}>
                {query.get('label')}
              </Label>
            </Flex>
          </>
        )}
      </DashboardHeader>
      {isLoading ? (
        <Flex justify="center" align="center" style={{ height: '70vh' }}>
          <Loading varient="primary" />
        </Flex>
      ) : (
        renderBugs()
      )}
    </BugsWrapper>
  );
};

export default Bugs;
