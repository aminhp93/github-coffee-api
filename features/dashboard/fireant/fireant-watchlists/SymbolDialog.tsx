import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FireantHistoricalPrice from "../fireant-historical-price";

type Props = {
  symbol?: string;
  onClose: () => void;
};

export default function SymbolDialog({ symbol, onClose }: Props) {
  return (
    <React.Fragment>
      <Dialog onClose={onClose} fullWidth maxWidth="lg" open>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {symbol}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <FireantHistoricalPrice />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
