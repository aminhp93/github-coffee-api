// Import libraries
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { GridColDef } from "@mui/x-data-grid-premium";
import WatchlistConfig from "../@core/WatchlistConfig";
import { useFireantWatchlistStore } from "./context";
import { getFields } from "./utils";

type Props = {
  columns: GridColDef[];
};

const Header = (props: Props) => {
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

  const listKeys = Object.keys(getFields(props.columns));

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box>
        <WatchlistConfig disabled={loading} />
      </Box>
      <Box>
        <ToggleButtonGroup size="small" {...controlCompany}>
          {listKeys.map((item) => (
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
