import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, Typography, useTheme } from "@mui/material";
import { useGetDashboardClientQuery } from "state/api";

const BreakdownChart = () => {

  const id = localStorage.getItem('userId');
  const { data, isLoading } = useGetDashboardClientQuery(id);
  const theme = useTheme();

  if (!data || isLoading) return "Chargement...";

  const formattedData = [
    {
        id: "Factures Payées",
        label: "Payé",
        value: data.totalPaidInvoices,
        color: theme.palette.secondary[400],
      },
      {
        id: "Factures Impayées",
        label: "Impayé",
        value: data.totalUnpaidInvoices,
        color: theme.palette.secondary[200],
      },
];

  return (
    <Box
      height= "400px"
      width={undefined}
      minHeight= "325px"
      minWidth= "325px"
      position="relative"
    >
      <ResponsivePie
        data={formattedData}
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
        colors={{ datum: "data.color" }}
        margin={{ top: 40, right: 80, bottom: 100, left: 50 }}
        sortByValue={true}
        innerRadius={0.45}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        enableArcLinkLabels={true}
        arcLinkLabelsTextColor={theme.palette.secondary[200]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX:  20,
            translateY:  50, 
            itemsSpacing: 0,
            itemWidth: 85,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: theme.palette.primary[500],
                },
              },
            ],
          },
        ]}
      />
      <Box
        position="absolute"
        top="50%"
        left="50.5%"
        color={theme.palette.secondary[400]}
        textAlign="center"
        pointerEvents="none"
        sx={{
          transform:  "translate(-75%, -170%)",
        }}
      >
        <Typography variant="h6" color="orange">
              {true && "Total:"} {data.totalPaidAmount} DH
        </Typography>
      </Box>
    </Box>
  );
};

export default BreakdownChart;