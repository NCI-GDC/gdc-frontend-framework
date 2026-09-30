import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import Script from "next/script";
import { ColorSchemeScript } from "@mantine/core";

interface ExtendedDocumentProps extends DocumentInitialProps {
  nonce?: string;
}

class GdcDocument extends Document<ExtendedDocumentProps> {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<ExtendedDocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);
    const nonce = ctx.req?.headers?.["x-nonce"] as string | undefined;

    return {
      ...initialProps,
      nonce,
    };
  }

  render() {
    const { nonce } = this.props;

    return (
      <Html>
        <Head nonce={nonce}>
          <ColorSchemeScript defaultColorScheme="auto" nonce={nonce} />
          <Script
            src="https://assets.adobedtm.com/6a4249cd0a2c/785de09de161/launch-70d67a6a40a8.min.js"
            async
            nonce={nonce}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default GdcDocument;
