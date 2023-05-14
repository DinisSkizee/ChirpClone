import { type NextPage } from "next";
import Head from "next/head";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chirp-Clone</title>
        <meta name="description" content="Chirp-Clone" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css"
          rel="stylesheet"
        />
      </Head>
      <main className="flex h-screen justify-center">
        <div>Single Post Page</div>
      </main>
    </>
  );
};

export default SinglePostPage;
