import React, { useState, useEffect } from "react";
import FlexBetween from "componementClient/FlexBetween";
import {
  DownloadOutlined,
  PersonAdd,
  CheckCircleOutline,
  HourglassEmpty,
  ErrorOutline,
} from "@mui/icons-material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "componementClient/BreakdownChart";
import OverviewChart from "componementClient/OverviewChart";
import {
  useGetDashboardClientQuery,
  useGetOnePackQuery,
} from "state/api";
import StatBox from "componementClient/StatBox";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    invoices: [],
    totalPaidAmount: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalInvoices: 0,
    totalPaidInvoices: 0,
    totalUnpaidInvoices: 0,
    yearlyTotalSoldUnits: [],
    yearlySalesTotal: [],
    monthlyData: [],
    salesByCategory: [],
    thisMonthStats: [],
    todayStats: [],
  });
  const id = localStorage.getItem("userId");
  const packId = localStorage.getItem("packId");
  const theme = useTheme();
  const genererRapport = "6630fe581c1fec2176ead2c9";
  const { data: packData } = useGetOnePackQuery(packId);
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data, isLoading } = useGetDashboardClientQuery(id);
  const [generateRapport, setGenerateRapport] = useState(false);

  useEffect(() => {
    if (packData) {
      setGenerateRapport(
        packData.services.some(
          (service) => service.serviceId === genererRapport
        )
      );
    }
  }, [packData]);

  useEffect(() => {
    if (data) {
      setDashboard({
        invoices: data.invoices,
        totalPaidAmount: data.totalPaidAmount,
        totalCustomers: data.totalCustomers,
        totalProducts: data.totalProducts,
        totalInvoices: data.totalInvoices,
        totalPaidInvoices: data.totalPaidInvoices,
        totalUnpaidInvoices: data.totalUnpaidInvoices,
        yearlyTotalSoldUnits: data.yearlyTotalSoldUnits,
        yearlySalesTotal: data.yearlySalesTotal,
        monthlyData: data.monthlyData,
        salesByCategory: data.salesByCategory,
        thisMonthStats: data.thisMonthStats,
        todayStats: data.todayStats,
      });
    }
  }, [data]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateString);
      return "";
    }
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("fr-FR", options);
  };

  const columns = [
    {
      field: "invoiceNumber",
      headerName: "Numéro de Facture",
      flex: 0.7,
      renderCell: (params) => (
        <span
          style={{
            display: "inline-block",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "gray",
            borderRadius: "4px",
            padding: "5px 10px",
            lineHeight: "1",
          }}
        >
          #{params.value}
        </span>
      ),
    },
    {
      field: "clientId",
      headerName: "Client",
      flex: 1,
      renderCell: (params) => params.row.clientId.name,
    },
    {
      field: "date",
      headerName: "Date de création",
      flex: 0.5,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "dueDate",
      headerName: "Date d'échéance",
      flex: 0.5,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "items",
      headerName: "Produits",
      flex: 0.4,
      sortable: false,
      renderCell: (params) => {
        // Sum the quantities of all items in the array
        const totalQuantity = params.value.reduce(
          (acc, curr) => acc + curr.quantity,
          0
        );
        return totalQuantity;
      },
    },
    {
      field: "amount",
      headerName: "Montant",
      flex: 0.7,
      renderCell: (params) => {
        // Extract the amount from the payments array
        const paymentAmounts = params.value;
        const textColor = theme.palette.mode === "dark" ? "cyan" : "green";
        // Display the total amount
        return (
          <span style={{ color: textColor }}>
            {paymentAmounts.toFixed(2)} DH
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => {
        const status = params.value;
        let icon, backgroundColor;

        switch (status) {
          case "sent":
            icon = (
              <HourglassEmpty style={{ color: "white", fontSize: "1rem" }} />
            );
            backgroundColor = "orange";
            break;
          case "paid":
            icon = (
              <CheckCircleOutline
                style={{ color: "white", fontSize: "1rem" }}
              />
            );
            backgroundColor = "green";
            break;
          case "late":
            icon = (
              <ErrorOutline style={{ color: "white", fontSize: "1rem" }} />
            );
            backgroundColor = "red";
            break;
          default:
            icon = null;
            backgroundColor = "transparent";
        }

        return (
          <span
            style={{
              display: "inline-block",
              alignItems: "center",
              color: "white",
              backgroundColor: backgroundColor,
              borderRadius: "4px",
              padding: "5px 10px",
              lineHeight: "1",
            }}
          >
            {icon} {status}
          </span>
        );
      },
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Box>
          <Typography
            variant="h2"
            color={theme.palette.secondary[100]}
            fontWeight="bold"
            sx={{ mb: "5px" }}
          >
            TABLEAU DE BORD
          </Typography>
          <Typography variant="h5" color={theme.palette.secondary[300]}>
            Bienvenue sur votre tableau de bord
          </Typography>
        </Box>
        {generateRapport ? (
          <Box>
            <Button
              sx={{
                backgroundColor: theme.palette.secondary[400],
                color: theme.palette.secondary[50],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <DownloadOutlined sx={{ mr: "10px" }} />
              Télécharger Rapports
            </Button>
          </Box>
        ) : (
          ""
        )}
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Total  Clients"
          value={dashboard && dashboard.totalCustomers}
          icon={
            <PersonAdd
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Total Produits"
          value={dashboard && dashboard.totalProducts}
          icon={
            <AddShoppingCartIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart view="sales" isDashboard={true} />
        </Box>
        <StatBox
          title="Total Factures"
          value={dashboard && dashboard.totalInvoices}
          icon={
            <ReceiptIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Ventes (Dhs)"
          value={dashboard && dashboard.totalPaidAmount.toFixed(2)}
          icon={
            <MonetizationOnIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            loading={isLoading || !dashboard}
            getRowId={(row) => row._id}
            rows={(dashboard && dashboard.invoices) || []}
            columns={columns}
          />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Factures Par Status
          </Typography>
          <BreakdownChart />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Répartition des factures et des informations par status de revenus
            réalisés pour cette année et ventes totales.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
