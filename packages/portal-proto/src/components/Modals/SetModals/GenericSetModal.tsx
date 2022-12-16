import React, { useState } from "react";
import { Modal, Tabs } from "@mantine/core";
import { useCoreDispatch, hideModal } from "@gff/core";
import { modalStyles, tabStyles } from "./styles";
import DiscardChangesModal from "./DiscardChangesModal";

interface GenericSetModalProps {
  readonly modalTitle: string;
  readonly userEnteredInput: boolean;
  readonly tabbed: boolean;
  readonly tabLabel?: string;
  readonly children: React.ReactNode;
}

const GenericSetModal: React.FC<GenericSetModalProps> = ({
  modalTitle,
  userEnteredInput,
  tabbed,
  tabLabel,
  children,
}: GenericSetModalProps) => {
  const dispatch = useCoreDispatch();
  const [showDiscardModal, setShowDiscardModal] = useState<
    "close" | "tabChange" | null
  >(null);
  const [activeTab, setActiveTab] = useState<string | null>("input");
  const [activeTabInWaiting, setActiveTabInWaiting] = useState<string | null>(
    null,
  );

  const onTabChange = (tab: string) => {
    if (userEnteredInput) {
      setShowDiscardModal("tabChange");
      setActiveTabInWaiting(tab);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <Modal
      opened
      title={modalTitle}
      onClose={() =>
        userEnteredInput ? setShowDiscardModal("close") : dispatch(hideModal())
      }
      size="xl"
      withinPortal={false}
      classNames={modalStyles}
      closeButtonLabel="close modal"
    >
      <DiscardChangesModal
        openModal={showDiscardModal !== null}
        action={() => {
          showDiscardModal === "close"
            ? dispatch(hideModal())
            : setActiveTab(activeTabInWaiting);
        }}
        onClose={() => setShowDiscardModal(null)}
      />
      {tabbed ? (
        <Tabs
          value={activeTab}
          classNames={tabStyles}
          keepMounted={false}
          onTabChange={onTabChange}
        >
          <Tabs.List>
            <Tabs.Tab value="input">Enter {tabLabel}</Tabs.Tab>
            <Tabs.Tab value="saved">Saved Sets</Tabs.Tab>
          </Tabs.List>
          {children}
        </Tabs>
      ) : (
        children
      )}
    </Modal>
  );
};

export default GenericSetModal;
