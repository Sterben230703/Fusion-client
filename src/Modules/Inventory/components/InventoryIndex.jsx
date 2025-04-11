import React from "react";
import { useMantineTheme } from "@mantine/core";
import SectionNavigation from "./SectionNavigation";

function InventoryIndex() {
  const theme = useMantineTheme();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "90vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 7.5,
          marginRight: theme.spacing.md,
          height: "100%",
          overflow: "hidden",
        }}
      >
        <SectionNavigation />
        {/* <h1>
        hi
      </h1> */}
      </div>
    </div>
  );
}

export default InventoryIndex;
