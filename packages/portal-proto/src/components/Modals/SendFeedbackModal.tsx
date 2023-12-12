import { ActionIcon, CopyButton, Modal, Tooltip } from "@mantine/core";
import { LuCopy as CopyIcon } from "react-icons/lu";

const SendFeedbackModal = ({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) => (
  <Modal
    opened={opened}
    onClose={onClose}
    closeOnEscape
    title="Send Feedback"
    classNames={{
      header: "p-2",
    }}
  >
    <div className="px-4 pb-4 pt-2 font-content text-sm">
      <p>
        We are continuously working on improving GDC 2.0 and would greatly
        appreciate feedback from our users.
      </p>
      <br></br>
      <p>
        Please send any suggestions you have to our team at{" "}
        <span className="flex items-center">
          <a
            href="mailto:support@nci-gdc.datacommons.io"
            className="text-primary-darker font-bold underline"
            target="blank"
          >
            support@nci-gdc.datacommons.io
          </a>
          .
          <Tooltip label="Copy email to clipboard" zIndex={400} withArrow>
            <span>
              <CopyButton value="support@nci-gdc.datacommons.io">
                {({ copied, copy }) => (
                  <ActionIcon
                    className={`${
                      copied ? "text-nci-green" : "text-accent-vivid"
                    }`}
                    onClick={copy}
                    aria-label="Copy email to clipboard"
                  >
                    <CopyIcon />
                  </ActionIcon>
                )}
              </CopyButton>
            </span>
          </Tooltip>
        </span>
      </p>
    </div>
  </Modal>
);

export default SendFeedbackModal;
