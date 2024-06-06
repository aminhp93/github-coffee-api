import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import useConfigStore from "./useConfigStore";
import { Display, Category, TimeRange } from "./types";
import { LIST_DISPLAY, LIST_CATEGORY, LIST_TIME_RANGE } from "./constants";

const Header = () => {
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

  const handleChangeCompany = (
    event: React.MouseEvent<HTMLElement>,
    data: Category
  ) => {
    setConfig({
      ...config,
      category: data,
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

  const controlCompany = {
    value: config.category,
    onChange: handleChangeCompany,
    exclusive: true,
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <ToggleButtonGroup size="small" {...controlCompany}>
        {LIST_CATEGORY.map((item) => (
          <ToggleButton value={item.value} key={item.value}>
            {<item.label />}
            {item.value}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

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

export default Header;
