import React, { createContext, useState } from "react";
import { Modal, Tabs } from "@mantine/core";
import { useCoreDispatch, hideModal } from "@gff/core";
import { modalStyles, tabStyles } from "./SetModals/styles";
import DiscardChangesModal from "./DiscardChangesModal";

export const UserInputContext = createContext([]);

interface GenericInputModalProps {
  readonly modalTitle: string;
  readonly children: React.ReactNode;
  readonly tabs?: { label: string; value: string }[];
}

const GenericInputModal: React.FC<GenericInputModalProps> = ({
  modalTitle,
  children,
  tabs,
}: GenericInputModalProps) => {
  const dispatch = useCoreDispatch();
  const [showDiscardModal, setShowDiscardModal] = useState<
    "close" | "tabChange" | null
  >(null);
  const [activeTab, setActiveTab] = useState<string | null>(tabs?.[0]?.value);
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
        {tabs ? (
          <Tabs
            value={activeTab}
            classNames={tabStyles}
            keepMounted={false}
            onTabChange={onTabChange}
          >
            <Tabs.List>
              {tabs.map((tab) => (
                <Tabs.Tab value={tab.value} key={tab.value}>
                  {tab.label}
                </Tabs.Tab>
              ))}
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

export default GenericInputModal;
