import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import Counter from "../features/counter/Counter";

const IndexPage: NextPage = () => {
  return (
    <div className="container mx-auto min-h-screen">
      <Head>
        <title>GDC Portal Prototype</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col content-center">
        <Image src="/logo.svg" alt="logo" width="300em" height="300em" />
        <Counter />
        <span className="text-center">
          Edit <code>src/App.tsx</code> and save to reload.
        </span>
        <span className="text-center">
          <span>Learn </span>
          <a
            className="text-purple-500"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="text-purple-500"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="text-purple-500"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="text-purple-500"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </div>
    </div>
  );
};

export default IndexPage;
