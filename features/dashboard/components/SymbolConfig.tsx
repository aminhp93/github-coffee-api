import { Box, TextField } from "@mui/material";
import useFireantStore from "@/@core/services/fireant/useFireantStore";

const SymbolConfig = () => {
  const setSelectedSymbol = useFireantStore((state) => state.setSelectedSymbol);
  const selectedSymbol = useFireantStore((state) => state.selectedSymbol);

  const handleChange = (event: any) => {
    setSelectedSymbol(event.target.value);
  };

  return (
    <Box>
      <TextField value={selectedSymbol} onChange={handleChange} />
    </Box>
  );
};

export default SymbolConfig;
