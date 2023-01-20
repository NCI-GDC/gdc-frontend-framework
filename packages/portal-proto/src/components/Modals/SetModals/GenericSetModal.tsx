import React, { createContext, useState } from "react";
import { Modal, Tabs } from "@mantine/core";
import { useCoreDispatch, hideModal } from "@gff/core";
import { modalStyles, tabStyles } from "./styles";
import DiscardChangesModal from "./DiscardChangesModal";

export const UserInputContext = createContext([]);

interface GenericSetModalProps {
  readonly modalTitle: string;
  readonly tabbed: boolean;
  readonly children: React.ReactNode;
  readonly tabLabel?: string;
}

const GenericSetModal: React.FC<GenericSetModalProps> = ({
  modalTitle,
  tabbed,
  children,
  tabLabel,
}: GenericSetModalProps) => {
  const dispatch = useCoreDispatch();
  const [showDiscardModal, setShowDiscardModal] = useState<
    "close" | "tabChange" | null
  >(null);
  const [activeTab, setActiveTab] = useState<string | null>("input");
  const [activeTabInWaiting, setActiveTabInWaiting] = useState<string | null>(
    null,
  );
  const [userEnteredInput, setUserEnteredInput] = useState(false);

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
      <UserInputContext.Provider
        value={[userEnteredInput, setUserEnteredInput]}
      >
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
      </UserInputContext.Provider>
    </Modal>
  );
};

export default GenericSetModal;
