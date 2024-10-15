import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import useConfigStore from "../useConfigStore";
import { Display, TimeRange } from "../types";
import { LIST_DISPLAY, LIST_TIME_RANGE } from "../constants";

const TimeAndDisplayConfig = () => {
  const config = useConfigStore((state) => state.config);
  const setConfig = useConfigStore((state) => state.setConfig);

  const handleChangeDisplayType = (
    event: React.MouseEvent<HTMLElement>,
    data: Display
  ) => {
    setConfig({
      ...config,
      displayType: data,
    });
  };

  const handleChangeTimeRange = (
    event: React.MouseEvent<HTMLElement>,
    data: TimeRange
  ) => {
    setConfig({
      ...config,
      timeRange: data,
    });
  };

  const controlDisplayType = {
    value: config.displayType,
    onChange: handleChangeDisplayType,
    exclusive: true,
  };

  const controlTimeRange = {
    value: config.timeRange,
    onChange: handleChangeTimeRange,
    exclusive: true,
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <ToggleButtonGroup size="small" {...controlTimeRange}>
        {LIST_TIME_RANGE.map((item) => (
          <ToggleButton value={item.value} key={item.value}>
            {item.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <ToggleButtonGroup size="small" {...controlDisplayType}>
        {LIST_DISPLAY.map((item) => (
          <ToggleButton value={item.value} key={item.value}>
            {<item.label />}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default TimeAndDisplayConfig;
