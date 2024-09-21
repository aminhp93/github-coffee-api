import dynamic from "next/dynamic";

const Test = dynamic(() => import("@/features/test"), {
  ssr: false,
});

const TestPage = () => {
  return <Test />;
};

export default TestPage;
