// Import libraries
import { Box } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

// Import local files: relative path
import useFireantStore from "@/@core/services/fireant/useFireantStore";
import Table from "@/@core/components/table";

// Import local files: absolute path
import { getColumns, getFields } from "./utils";
import { useFireantWatchlistStore, FireantWatchlistProvider } from "./context";
import SymbolDialog from "./SymbolDialog";
import Header from "./Header";

const FireantWatchlist = () => {
  const rows = useFireantWatchlistStore((state) => state.rows);
  const config = useFireantWatchlistStore((state) => state.config);
  const setSelectedSymbol = useFireantStore((state) => state.setSelectedSymbol);
  const selectedSymbol = useFireantStore((state) => state.selectedSymbol);

  const [openSymbolDialog, setOpenSymbolDialog] = useState(false);

  const onClickSymbol = useCallback(
    (symbol: string) => {
      setOpenSymbolDialog(true);
      setSelectedSymbol(symbol);
    },
    [setSelectedSymbol]
  );

  const columns = useMemo(() => {
    return getColumns(onClickSymbol);
  }, [onClickSymbol]);

  const columnVisibilityModel = useMemo(() => {
    return getFields(columns)[config];
  }, [config, columns]);

  return (
    <Box>
      <Header columns={columns} />

      <Box
        sx={{
          height: "600px",
          "& .color-red": {
            color: "rgb(238, 84, 66)",
          },
          "& .color-green": {
            color: "rgb(0, 170, 0)",
          },
          "& .color-unset": {
            color: "unset",
          },
          "& .color-yellow": {
            color: "rgb(204, 170, 0)",
          },
        }}
      >
        <Table
          columns={columns}
          checkboxSelection={false}
          rows={rows}
          columnVisibilityModel={columnVisibilityModel}
        />
      </Box>
      {openSymbolDialog && (
        <SymbolDialog
          symbol={selectedSymbol}
          onClose={() => {
            setOpenSymbolDialog(false);
          }}
        />
      )}
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
