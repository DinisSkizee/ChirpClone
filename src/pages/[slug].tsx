import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { LoadingPage } from "~/components/LoadingPage";
import { PageLayout } from "~/components/PageLayout";
import { PostView } from "~/components/PostView";
import { generateSSGHelper } from "~/server/helpers/sshHelper";
import { api } from "~/utils/api";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <LoadingPage />;

  if (!data || data.length === 0) return <div>User has not posted</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{}</title>
        <meta name="description" content="Chirp-Clone" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css"
          rel="stylesheet"
        />
      </Head>
      <PageLayout>
        <div className="flex flex-col h-36 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${
              data.username ?? data.externalUsername ?? "unknown"
            }'s profile pic`}
            width={128}
            height={128}
            className="relative h-fit mt-[80px] ml-4 rounded-full border-4 border-black bg-black"
          />
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          data.username ?? data.externalUsername ?? "unknown"
        }`}</div>
        <div className="w-full border-b border-slate-400" />
        <ProfileFeed userId={data.id} />
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
