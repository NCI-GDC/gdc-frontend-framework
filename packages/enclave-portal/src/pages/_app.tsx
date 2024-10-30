import "../styles/globals.css";
import { Footer } from "@gff/portal-components";

const EnclavePortalApp = () => {
  return (
    <Footer
      useVersionInfoDetailsHook={() => ({ data: {}, isSuccess: true })}
      linkColData={[]}
      linkCloud={[]}
      appInfo={{}}
    />
  );
};

export default EnclavePortalApp;
