import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { useGetSalesQuery } from "state/api";

const OverviewChart = ({ isDashboard = false, view }) => {
  const theme = useTheme();
  const id = localStorage.getItem("userId");
  const { data, isLoading } = useGetSalesQuery(id);

  const [totalSalesLine, totalUnitsLine] = useMemo(() => {
    if (!data) return [];

    const { monthlyData } = data;
    const totalSalesLine = {
      id: "totalVentes",
      color: theme.palette.secondary.main,
      data: [],
    };
    const totalUnitsLine = {
      id: "totalUnités",
      color: theme.palette.secondary[600],
      data: [],
    };

    Object.values(monthlyData).reduce(
      (acc, { month, totalSales, totalUnits }) => {
        const curSales = totalSales.toFixed(2);
        const curUnits = totalUnits;

        totalSalesLine.data = [
          ...totalSalesLine.data,
          { x: month, y: curSales },
        ];
        totalUnitsLine.data = [
          ...totalUnitsLine.data,
          { x: month, y: curUnits },
        ];

        return { sales: curSales, units: curUnits };
      },
      { sales: 0, units: 0 }
    );

    return [[totalSalesLine], [totalUnitsLine]];
  }, [data]);

  if (!data || isLoading) return "Chargement...";

  return (
    <ResponsiveLine
    data={view === "sales" ? totalSalesLine : totalUnitsLine}
    theme={{
      axis: {
        domain: {
          line: {
            stroke: theme.palette.secondary[50],
          },
        },
        legend: {
          text: {
            fill: theme.palette.secondary[200],
          },
        },
        ticks: {
          line: {
            stroke: theme.palette.secondary[200],
            strokeWidth: 1,
          },
          text: {
            fill: theme.palette.secondary[200],
          },
        },
      },
      legends: {
        text: {
          fill: theme.palette.secondary[200],
        },
      },
      tooltip: {
        container: {
          color: "#12244D",
        },
      },
    }}
    margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "0",
      max: "auto",
      stacked: false,
      reverse: false,
    }}
    yFormat=" >-.2f"
    curve="catmullRom"
    enableArea={true}
    //areaBaselineValue={isDashboard? 23000 : null}
    areaOpacity ={0.3}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      format: (v) => {
        if (isDashboard) return v.slice(0, 6);
        return v;
      },
      orient: "bottom",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: isDashboard ? "" : "Mois",
      legendOffset: 37,
      legendPosition: "middle",
    }}
    axisLeft={{
      orient: "left",
      tickValues: 5,
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: isDashboard
        ? ""
        : `Total Des ${view === "sales" ? "Revenus Par An (DHs)" : "Unités Par An (Pièces)"}`,
      legendOffset: -65,
      legendPosition: "middle",
    }}
    enableGridX={false}
    enableGridY={false}
    pointSize={10}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    useMesh={true}
    legends={
      !isDashboard
        ? [
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 30,
              translateY: -40,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]
        : undefined
    }
  />
);
};

export default OverviewChart;