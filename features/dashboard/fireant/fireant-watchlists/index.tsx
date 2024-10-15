// Import libraries
import Box from "@mui/material/Box";

// Import local files: relative path
import Table from "@/@core/components/table";
import { useMemo } from "react";

// Import local files: absolute path
import { COLUMNS, FIELDS } from "./constants";
import Header from "./Header";
import { FireantWatchlistProvider, useFireantWatchlistStore } from "./context";

const FireantWatchlist = () => {
  const rows = useFireantWatchlistStore((state) => state.rows);
  const config = useFireantWatchlistStore((state) => state.config);
  const columnVisibilityModel = useMemo(() => {
    return FIELDS[config];
  }, [config]);


  return (
    <Box>
      <Header />

      <Box
        sx={{
          height: "400px",
          "& .color-red": {
            color: "red",
          },
          "& .color-green": {
            color: "green",
          },
          "& .color-unset": {
            color: "unset",
          },
        }}
      >
        <Table
          columns={COLUMNS}
          checkboxSelection={false}
          rows={rows}
          columnVisibilityModel={columnVisibilityModel}
        />
      </Box>
    </Box>
  );
};

const WrapperFireantWatchlist = () => {
  return (
    <FireantWatchlistProvider>
      <FireantWatchlist />
    </FireantWatchlistProvider>
  );
};

export default WrapperFireantWatchlist;
