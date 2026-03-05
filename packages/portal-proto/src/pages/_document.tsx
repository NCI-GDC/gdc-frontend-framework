import Document, { DocumentContext, DocumentInitialProps } from "next/document";
import { ColorSchemeScript } from "@mantine/core";

class GdcDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <ColorSchemeScript defaultColorScheme="auto" />
        </>
      ),
    };
  }
}

export default GdcDocument;
