import dynamic from "next/dynamic";

const RootApi = dynamic(() => import("@/features/root-api"), {
  ssr: false,
});

const RootApiPage = () => {
  return <RootApi />;
};

export default RootApiPage;
