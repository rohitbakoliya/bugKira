import { Button } from '@bug-ui';

const CloseReopenButton = ({
  onRequestToggle,
  isOpen,
  isLoading,
}: {
  onRequestToggle: any;
  isOpen: boolean;
  isLoading: boolean;
}) => (
  <Button
    isLoading={isLoading}
    variant={isOpen ? 'danger' : 'success'}
    icon={isOpen ? 'times' : 'history'}
    onClick={(e: any) => {
      e.preventDefault();
      onRequestToggle(isOpen ? 'close' : 'open');
    }}
  >
    {isOpen ? 'Close Bug' : 'Reopen Bug'}
  </Button>
);

export default CloseReopenButton;
