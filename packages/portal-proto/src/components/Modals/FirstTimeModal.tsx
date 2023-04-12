import { Text } from "@mantine/core";
import { useCookies } from "react-cookie";
import { BaseModal } from "./BaseModal";

export const FirstTimeModal = ({
  openModal,
}: {
  openModal: boolean;
}): JSX.Element => {
  const [cookie, setCookie] = useCookies(["NCI-Warning"]);

  const handleAccept = () => {
    cookie["NCI-Warning"] || setCookie("NCI-Warning", true);
  };

  return (
    <BaseModal
      title={
        <Text size="lg" className="font-medium font-heading">
          Warning
        </Text>
      }
      closeButtonLabel="Accept"
      openModal={openModal}
      size="60%"
      buttons={[
        {
          title: "Accept",
          onClick: handleAccept,
          hideModalOnClick: true,
          dataTestId: "button-intro-warning-accept",
        },
      ]}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <div className="border-y border-y-base-darker py-4 space-y-4 font-content">
        <p>
          You are accessing a U.S. Government web site which may contain
          information that must be protected under the U. S. Privacy Act or
          other sensitive information and is intended for Government authorized
          use only.
        </p>
        <p>
          Unauthorized attempts to upload information, change information, or
          use of this web site may result in disciplinary action, civil, and/or
          criminal penalties. Unauthorized users of this web site should have no
          expectation of privacy regarding any communications or data processed
          by this web site.
        </p>
        <p>
          Anyone accessing this web site expressly consents to monitoring of
          their actions and all communication or data transiting or stored on or
          related to this web site and is advised that if such monitoring
          reveals possible evidence of criminal activity, NIH may provide that
          evidence to law enforcement officials.
        </p>
        <p>
          Please be advised that some features may not work with higher privacy
          settings, such as disabling cookies.
        </p>
        <p>
          <b>WARNING</b>: Data in the GDC is considered provisional as the GDC
          applies state-of-the art analysis pipelines which evolve over time.
          Please read the{" "}
          <a
            className="text-utility-link underline"
            href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes"
            target="_blank"
            rel="noreferrer"
          >
            GDC Data Release Notes
          </a>{" "}
          prior to accessing this web site as the Release Notes provide details
          about data updates, known issues and workarounds.
        </p>
        <p>
          Contact{" "}
          <a
            className="text-utility-link underline"
            href="https://gdc.cancer.gov/support#gdc-help-desk"
            target="_blank"
            rel="noreferrer"
          >
            GDC Support
          </a>{" "}
          for more information.
        </p>
      </div>
    </BaseModal>
  );
};
