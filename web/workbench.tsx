import * as React from "react";
import {
  ActionIcon,
  ColorScheme,
  ColorSchemeProvider,
  Tabs,
} from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import { MoonStars, Sun } from "tabler-icons-react";

import "./workbench.less";

import { Constructors } from "./constructors";
import { Statistics } from "./statistics";

const TabsList = [Constructors, Statistics];

export const Workbench = () => {
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const dark = colorScheme === "dark";

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Tabs
          defaultValue={TabsList[0].name}
          className="workbench-tabs"
          color="teal"
          variant="outline"
        >
          <Tabs.List position="center">
            {TabsList.map((t) => (
              <Tabs.Tab key={t.name} value={t.name}>
                {t.name}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {TabsList.map((t) => (
            <Tabs.Panel
              key={t.name}
              value={t.name}
              className="workbench-tabs-tabpane"
            >
              <t.render />
            </Tabs.Panel>
          ))}
        </Tabs>

        <ActionIcon
          variant="outline"
          color={dark ? "yellow" : "blue"}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
          style={{ position: "fixed", right: 2, top: 3 }}
        >
          {dark ? <Sun size="1.1rem" /> : <MoonStars size="1.1rem" />}
        </ActionIcon>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
