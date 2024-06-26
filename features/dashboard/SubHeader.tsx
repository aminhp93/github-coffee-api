import { Box } from "@mui/material";
import useConfigStore from "./useConfigStore";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useEffect } from "react";
import useFireantStore from "@/@core/services/fireant/useFireantStore";
import FireantService from "@/@core/services/fireant/Fireant.service";
import { keyBy } from "lodash";

const SubHeader = () => {
  const config = useConfigStore((state) => state.config);
  const setWatchlists = useFireantStore((state) => state.setWatchlists);
  const watchlists = useFireantStore((state) => state.watchlists);
  const selectedWatchlist = useFireantStore((state) => state.selectedWatchlist);
  const setSelectedWatchlist = useFireantStore(
    (state) => state.setSelectedWatchlist
  );

  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target.value, watchlists);
    const wlObj = keyBy(watchlists, "watchlistID");
    setSelectedWatchlist(wlObj[event.target.value as string]);
  };

  useEffect(() => {
    const init = async () => {
      const res = await FireantService.watchlists();
      setWatchlists(res);
    };
    init();
  }, [setWatchlists]);

  console.log(watchlists, selectedWatchlist);

  return (
    <Box>
      {config.company === "fireant" && (
        <Box>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Watchlist</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedWatchlist?.watchlistID || ("" as any)}
              label="Watchlist"
              onChange={handleChange}
            >
              {watchlists.map((watchlist) => (
                <MenuItem
                  key={watchlist.watchlistID}
                  value={watchlist.watchlistID}
                >
                  {watchlist.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

export default SubHeader;
