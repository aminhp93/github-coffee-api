/* eslint-disable @typescript-eslint/no-explicit-any */

import { createElement } from "react";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import useConfigStore from "./useConfigStore";
import { Category } from "./types";
import { LIST_CATEGORY } from "./constants";

const Dashboard = () => {
  const config = useConfigStore((state) => state.config);
  const setConfig = useConfigStore((state) => state.setConfig);

  const handleChangeCompany = (
    event: React.MouseEvent<HTMLElement>,
    data: Category
  ) => {
    setConfig({
      ...config,
      category: data,
    });
  };

  const controlCompany = {
    value: config.category,
    onChange: handleChangeCompany,
    exclusive: true,
  };

  const component: any = LIST_CATEGORY.find(
    (item) => item.value === config.category
  )?.component;

  return (
    <Box>
      <ToggleButtonGroup size="small" {...controlCompany}>
        {LIST_CATEGORY.map((item) => (
          <ToggleButton
            value={item.value}
            key={item.value}
            sx={{
              textTransform: "none",
            }}
          >
            {/* {<item.label />} */}
            {item.value}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {component && createElement(component)}
    </Box>
  );
};

export default Dashboard;
