import { Box } from "@mui/material";
import dynamic from "next/dynamic";

const Timeline = dynamic(() => import("@/features/timeline"), {
  ssr: false,
});

const Page = () => {
  return (
    <Box>
      <Timeline />
    </Box>
  );
};

export default Page;
