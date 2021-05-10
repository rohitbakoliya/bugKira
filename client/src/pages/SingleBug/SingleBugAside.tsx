import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { StoreState } from 'store';
import { editLabels } from 'store/ducks/single-bug';

import { Avatar, Button, Flex, Label, LabelTypes } from '@bug-ui';
import LabelEditDropdown from 'components/LabelEditDropdown';
import toast from 'react-hot-toast';

// get unique avatar images from all comments
const getParticipants = (bug: any): string[] => {
  return Object.values(bug?.entities?.comments || {})
    .map((comment: any) => comment.author?.username)
    .filter((item: string, pos: number, array: string[]) => array.indexOf(item) === pos);
};

interface SingleBugAsideProps {
  bugId: number | string;
  bug: any;
}
const SingleBugAside: React.FC<SingleBugAsideProps> = ({ bugId, bug }) => {
  const dispatch = useDispatch<any>();
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [labelEditPending, labelEditError] = useSelector((state: StoreState) => [
    state.loading['singlebug/EDIT_LABELS'],
    state.error['singlebug/EDIT_LABELS'],
  ]);

  const handleSaveLabel = (closeDropdown: Function) => {
    dispatch(editLabels(bugId, selectedLabels)).then(() => {
      closeDropdown(false);
    });
  };

  let participants: string[] = getParticipants(bug);
  labelEditError && toast.error(labelEditError as string);
  console.log(bug);
  return (
    <aside className="singlebug__aside--sticky">
      <div>
        <h4 className="label__header color--gray">
          <LabelEditDropdown
            updateSelectedLabels={labels => setSelectedLabels(labels)}
            defaultChecked={bug?.result.labels}
            trigger={
              <span data-testid="label_dropdown">
                Labels
                <FontAwesomeIcon size="sm" icon="cog" />
              </span>
            }
          >
            {close => (
              <Button
                icon="tag"
                size="small"
                isLoading={labelEditPending as boolean}
                onClick={() => {
                  handleSaveLabel(close);
                }}
              >
                Update labels
              </Button>
            )}
          </LabelEditDropdown>
        </h4>

        <Flex gap="medium">
          {bug?.result?.labels.map((label: LabelTypes, i: number) => (
            <Label className="mt-medium" type={label} key={i}>
              {label}
            </Label>
          ))}
        </Flex>
      </div>
      <div>
        <h4 className="color--gray">{participants.length} participants</h4>
        <Flex gap="medium">
          {participants.map((participant: string, i: number) => (
            <Avatar key={i} width="40px" height="40px" size={45} username={participant} />
          ))}
        </Flex>
      </div>
    </aside>
  );
};

export default SingleBugAside;
