import React, { createContext, useState } from "react";
import { Modal, Tabs } from "@mantine/core";
import { useCoreDispatch, hideModal } from "@gff/core";
import { StyledTabsList, StyledTab } from "@/components/StyledComponents/Tabs";
import { modalStyles } from "./styles";
import DiscardChangesModal from "./DiscardChangesModal";

export const UserInputContext = createContext([]);

interface UserInputModalProps {
  readonly modalTitle: string;
  readonly children: React.ReactNode;
  readonly tabs?: { label: string; value: string }[];
}

/***
 * Modal that handles displaying the discard changes modal when certain actions are taken
 * (user changes tabs, tries to closes the modal, etc) and the user has entered some input.
 * Children should use `UserInputContext` to set when the user has entered input.
 */
const UserInputModal: React.FC<UserInputModalProps> = ({
  modalTitle,
  children,
  tabs,
}: UserInputModalProps) => {
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
          <Tabs value={activeTab} keepMounted={false} onTabChange={onTabChange}>
            <StyledTabsList>
              {tabs.map((tab) => (
                <StyledTab value={tab.value} key={tab.value}>
                  {tab.label}
                </StyledTab>
              ))}
            </StyledTabsList>
            {children}
          </Tabs>
        ) : (
          children
        )}
      </UserInputContext.Provider>
    </Modal>
  );
};

export default UserInputModal;
