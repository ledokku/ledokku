import { CssBaseline } from '@nextui-org/react';
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';

function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        {CssBaseline.flush()}
        <title>Overclock Studios PaaS</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await Document.getInitialProps(ctx);
  return {
    ...initialProps,
    styles: React.Children.toArray([initialProps.styles]),
  };
};

export default MyDocument;
