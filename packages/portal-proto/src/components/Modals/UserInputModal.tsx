import React, { createContext, useState } from "react";
import { Modal, Tabs } from "@mantine/core";
import { useCoreDispatch, hideModal } from "@gff/core";
import { StyledTab } from "@/components/StyledComponents/Tabs";
import DiscardChangesModal from "./DiscardChangesModal";

export const UserInputContext = createContext([]);

interface UserInputModalProps {
  readonly modalTitle: string;
  readonly children: React.ReactNode;
  readonly tabs?: { label: string; value: string }[];
  readonly opened: boolean;
}

/***
 * Modal that handles displaying the discard changes modal when certain actions are taken
 * (user changes tabs, tries to closes the modal, etc) and the user has entered some input.
 * Children should use `UserInputContext` to set when the user has entered input.
 * @param modalTitle - title of the modal
 * @param children - children to render in the modal
 * @param tabs - tabs to render in the modal
 * @param opened - boolean to open and close the modal
 * @category Modals
 */
const UserInputModal: React.FC<UserInputModalProps> = ({
  modalTitle,
  children,
  tabs,
  opened,
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
      opened={opened}
      title={modalTitle}
      onClose={() =>
        userEnteredInput ? setShowDiscardModal("close") : dispatch(hideModal())
      }
      size={900}
    >
      {opened && (
        <>
          <DiscardChangesModal
            openModal={showDiscardModal !== null}
            action={() => {
              if (showDiscardModal === "close") {
                dispatch(hideModal());
              } else {
                setActiveTab(activeTabInWaiting);
              }
            }}
            onClose={() => setShowDiscardModal(null)}
          />
          <UserInputContext.Provider
            value={[userEnteredInput, setUserEnteredInput]}
          >
            {tabs ? (
              <Tabs
                value={activeTab}
                keepMounted={false}
                onChange={onTabChange}
              >
                <Tabs.List data-testid="modal-tab-list">
                  {tabs.map((tab) => (
                    <StyledTab value={tab.value} key={tab.value}>
                      {tab.label}
                    </StyledTab>
                  ))}
                </Tabs.List>
                {children}
              </Tabs>
            ) : (
              children
            )}
          </UserInputContext.Provider>
        </>
      )}
    </Modal>
  );
};

export default UserInputModal;
