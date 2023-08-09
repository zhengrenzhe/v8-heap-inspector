import {
  Button,
  Input,
  Label,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  useId,
  Text,
} from "@fluentui/react-components";
import React from "react";
import {
  BsFilter,
  BsSortAlphaDown,
  BsSortDown,
  BsSortUp,
} from "react-icons/bs";

interface IFilterBarProps {
  filter?: {
    constructorName: string;
    onConstructorNameChanged: (constructorName: string) => void;
  };
  sort?: {
    sortMode: "asc" | "desc" | "alpha";
    toggleSortMode: () => void;
  };
}

export const FilterBar = (props: IFilterBarProps) => {
  const inputId = useId("input-with-placeholder");

  return (
    <div className="filter-actions" style={{ padding: "0 8px 4px" }}>
      {props.filter ? (
        <Popover
          positioning={{
            position: "after",
            align: "bottom",
            offset: 10,
          }}
          size="small"
        >
          <PopoverTrigger disableButtonEnhancement>
            <Button
              size="small"
              icon={<BsFilter style={{ fontSize: 15 }} />}
              style={{ borderRadius: "100%" }}
            />
          </PopoverTrigger>

          <PopoverSurface>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Label htmlFor={inputId}>
                <Text size={200}>Filter by constructor name</Text>
              </Label>
              <Input
                id={inputId}
                autoFocus
                value={props.filter.constructorName}
                onChange={(e) =>
                  props.filter?.onConstructorNameChanged(e.target.value.trim())
                }
              />
            </div>
          </PopoverSurface>
        </Popover>
      ) : null}

      {props.sort ? (
        <Button
          size="small"
          title="sory by self size"
          onClick={props.sort.toggleSortMode}
          style={{ marginLeft: 8, borderRadius: "100%" }}
          icon={
            props.sort.sortMode === "asc" ? (
              <BsSortUp style={{ fontSize: 15 }} />
            ) : props.sort.sortMode === "desc" ? (
              <BsSortDown style={{ fontSize: 15 }} />
            ) : (
              <BsSortAlphaDown style={{ fontSize: 15 }} />
            )
          }
        />
      ) : null}
    </div>
  );
};
