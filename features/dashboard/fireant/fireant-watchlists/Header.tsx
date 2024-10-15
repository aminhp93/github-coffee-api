// Import libraries
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import WatchlistConfig from "../@components/WatchlistConfig";
import { useFireantWatchlistStore } from "./context";

const Header = () => {
  const config = useFireantWatchlistStore((state) => state.config);
  const setConfig = useFireantWatchlistStore((state) => state.setConfig);
  const loading = useFireantWatchlistStore((state) => state.loading);


  const controlCompany = {
    value: config,
    onChange: (_: React.MouseEvent<HTMLElement>, data: string) => {
      setConfig(data);
    },
    exclusive: true,
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box>
        <WatchlistConfig disabled={loading} />
      </Box>
      <Box>
        <ToggleButtonGroup size="small" {...controlCompany}>
          {[
            "all",
            "dailyUse",
            "check",
            "fundamental",
            "financialReports",
            "financialIndicators",
            "posts",
            "news",
          ].map((item) => (
            <ToggleButton
              value={item}
              key={item}
              sx={{
                textTransform: "none",
              }}
            >
              {item}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default Header;
