import Document, { DocumentContext, DocumentInitialProps } from "next/document";
import { resetIdCounter } from "react-tabs";

class GdcDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    // The sole purpose of this component is to reset the tab id counter.
    // This is needed in order to have deterministic results during
    // server side rendering.
    resetIdCounter();
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }
}

export default GdcDocument;
