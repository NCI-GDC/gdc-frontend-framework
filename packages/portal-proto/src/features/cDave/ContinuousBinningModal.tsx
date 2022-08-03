import { Button, Modal } from "@mantine/core";

interface ContinuousBinningModalProps {
  readonly setModalOpen: (open: boolean) => void;
}

const ContinuousBinningModal: React.FC<ContinuousBinningModalProps> = ({
  setModalOpen,
}: ContinuousBinningModalProps) => {
  return <Modal opened onClose={() => setModalOpen(false)}></Modal>;
};

export default ContinuousBinningModal;
