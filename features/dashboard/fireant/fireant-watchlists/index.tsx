// Import libraries
import { Box } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

// Import local files: relative path
import useFireantStore from "@/@core/services/fireant/useFireantStore";
import Table from "@/@core/components/table";

// Import local files: absolute path
import { COLUMNS, getFields } from "./constants";
import { useFireantWatchlistStore } from "./context";
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
    return COLUMNS(onClickSymbol);
  }, [onClickSymbol]);

  const columnVisibilityModel = useMemo(() => {
    return getFields(columns)[config];
  }, [columns, config]);

  return (
    <Box>
      <Header />

      <Box
        sx={{
          height: "600px",
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
          columns={columns}
          checkboxSelection={false}
          rows={rows}
          initialState={{
            columns: {
              columnVisibilityModel,
            },
          }}
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

export default FireantWatchlist;
