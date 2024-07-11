import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
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
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "componementClient/BreakdownChart";
import OverviewChart from "componementClient/OverviewChart";
import {
  useGetDashboardClientQuery,
  useGetOnePackQuery,
} from "state/api";
import StatBox from "componementClient/StatBox";
import axios from "axios";
import profileImage from "assets/logo.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("userId");
  if (!id) {
    navigate("/");
  }
  const [dashboard, setDashboard] = useState({
    invoices: [],
    totalPaidAmount: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalInvoices: 0,
    totalPaidInvoices: 0,
    totalUnpaidInvoices: 0,
  });
  const packId = localStorage.getItem("packId");
  const theme = useTheme();
  const genererRapport = "6630fe581c1fec2176ead2c9";
  const { data: packData } = useGetOnePackQuery(packId);
  //const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const isNonMediumScreens = useMediaQuery('(min-width: 768px)');
  const isSmallScreen = useMediaQuery('(max-width: 820px)');
  const { data, isLoading } = useGetDashboardClientQuery(id);
  const [enterpriseDetails, setEnterpriseDetails] = useState(null);
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
      });
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Api/Entreprise/entreprisedetail/${id}`);
        setEnterpriseDetails(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchData();
    } else {
      navigate("/");
    }
  
  }, [id, navigate]); 

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

  const generatePDF = async () => {
    const doc = new jsPDF("p", "pt", "a4");
  
    // Set common styles
    const marginX = 40;
    const marginY = 40;
    const sectionGap = 30;
    const cardHeight = 60;
    const primaryColor = [255, 102, 0]; // Orange
    const secondaryColor = [255, 255, 255]; // White
    const textColor = [0, 0, 0]; // Black
    const bgColor = [240, 240, 240]; // Light grey for alternation
    const boxShadow = [200, 200, 200]; // Light shadow color
  
    // Add web app logo
    const webAppLogo = new Image();
    webAppLogo.src = profileImage;
    doc.addImage(webAppLogo, "PNG", marginX, marginY, 190, 90);
  
    // Title
    doc.setFontSize(19);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.setFillColor(...primaryColor);
    doc.roundedRect(220, marginY + 90, 180, 30, 10, 10, "FD");
    doc.text("Rapport", 310, marginY + 110, { align: "center" });
  
    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text("Date: " + new Date().toLocaleDateString(), doc.internal.pageSize.getWidth() - marginX, marginY + 140, { align: "right" });
  
    // Enterprise details
    if (enterpriseDetails) {
      const enterpriseLogo = new Image();
      enterpriseLogo.src = enterpriseDetails.logo.url;
      const detailsY = marginY + 170;
      const detailsBoxHeight = 100;
  
      doc.setLineWidth(0.5);
      doc.setDrawColor(...boxShadow);
      doc.setFillColor(...secondaryColor);
      doc.roundedRect(marginX, detailsY, doc.internal.pageSize.getWidth() - 2 * marginX, detailsBoxHeight, 10, 10, "FD");
      doc.addImage(enterpriseLogo, "PNG", marginX + 10, detailsY + 10, 80, 80, undefined, 'FAST');
      doc.setFontSize(12);
      doc.setTextColor(...textColor);
      doc.setFont("helvetica", "bold");
      doc.text(`Nom:`, marginX + 100, detailsY + 20);
      doc.setFont("helvetica", "normal");
      doc.text(`${enterpriseDetails.name}`, marginX + 150, detailsY + 20);
      doc.setFont("helvetica", "bold");
      doc.text(`Email:`, marginX + 100, detailsY + 40);
      doc.setFont("helvetica", "normal");
      doc.text(`${enterpriseDetails.email}`, marginX + 150, detailsY + 40);
      doc.setFont("helvetica", "bold");
      doc.text(`Téléphone:`, marginX + 100, detailsY + 60);
      doc.setFont("helvetica", "normal");
      doc.text(`${enterpriseDetails.phone}`, marginX + 185, detailsY + 60);
      doc.setFont("helvetica", "bold");
      doc.text(`Adresse:`, marginX + 100, detailsY + 80);
      doc.setFont("helvetica", "normal");
      doc.text(`${enterpriseDetails.address}`, marginX + 168, detailsY + 80);
    }
  
    // Horizontal line
    const lineY = marginY + 290;
    doc.setLineWidth(0.5);
    doc.setDrawColor(128, 128, 128);
    doc.line(marginX, lineY, doc.internal.pageSize.getWidth() - marginX, lineY);
  
    // Dashboard data title
    let yOffset = lineY + sectionGap;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.setFillColor(...textColor);
    doc.text("Vos Statistiques Générales", doc.internal.pageSize.getWidth() / 2, yOffset, { align: "center", underline: true });
  
    // Dashboard data
    const sections = [
      { title: "Clients", value: dashboard.totalCustomers },
      { title: "Produits", value: dashboard.totalProducts },
      { title: "Factures", value: dashboard.totalInvoices },
      { title: "Revenue", value: `${dashboard.totalPaidAmount.toFixed(2)} DH` },
      { title: "F. Payées", value: dashboard.totalPaidInvoices },
      { title: "F. Impayées", value: dashboard.totalUnpaidInvoices },
    ];
  
    yOffset += sectionGap;
    const cardWidth = (doc.internal.pageSize.getWidth() - 1.5 * marginX - sectionGap * (sections.length - 1)) / sections.length;
    sections.forEach((section, index) => {
      const xPosition = marginX + index * (cardWidth + sectionGap);
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.setFillColor(...secondaryColor);
      doc.roundedRect(xPosition, yOffset, cardWidth, cardHeight, 10, 10, "FD");
      doc.setFont("helvetica", "bold");
      doc.text(section.title, xPosition + cardWidth / 2, yOffset + 15, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.text(section.value.toString(), xPosition + cardWidth / 2, yOffset + 50, { align: "center" });
    });
  
    yOffset += cardHeight + sectionGap * 2;
  
    // Invoice table title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.setFillColor(...textColor);
    doc.text("Détails des Dernières Factures", doc.internal.pageSize.getWidth() / 2, yOffset, { align: "center", underline: true });
    yOffset += sectionGap;
  
    // Invoice table
    const tableColumns = ["Numéro de Facture", "Client", "Date de création", "Date d'échéance", "Produits", "Montant", "Status"];
    const tableRows = dashboard.invoices.map(invoice => [
      invoice._id,
      invoice.clientId.name,
      formatDate(invoice.date),
      formatDate(invoice.dueDate),
      invoice.items.reduce((acc, curr) => acc + curr.quantity, 0),
      `${invoice.amount.toFixed(2)} DH`,
      invoice.status
    ]);
  
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: yOffset,
      theme: "grid",
      headStyles: { fillColor: primaryColor, textColor: secondaryColor, fontStyle: "bold" },
      bodyStyles: { fillColor: bgColor },
      alternateRowStyles: { fillColor: secondaryColor },
      margin: { top: sectionGap },
    });
  
    // Capture and add charts to the PDF
    setTimeout(async () => {
      const chart1 = document.getElementById("overview-chart");
      const chart2 = document.getElementById("breakdown-chart");
  
      if (!chart1 || !chart2) {
        console.log("Charts not found");
        return;
      }
  
      const options = { scale: 2 };
  
      try {
        const chart1Image = await html2canvas(chart1, options);
        const chart2Image = await html2canvas(chart2, options);
  
        const chart1DataURL = chart1Image.toDataURL("image/jpeg");
        const chart2DataURL = chart2Image.toDataURL("image/jpeg");
  
        const pageHeight = doc.internal.pageSize.height;
        const afterTableY = doc.lastAutoTable.finalY + sectionGap;
  
        if (afterTableY + 220 > pageHeight) {
          doc.addPage();
          yOffset = marginY;
        } else {
          yOffset = afterTableY;
        }
  
        // First chart
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...primaryColor);
        doc.setFillColor(...textColor);
        doc.text("Ventes réussites réalisées cette année", doc.internal.pageSize.getWidth() / 2, yOffset, { align: "center", underline: true });
        yOffset += sectionGap;
        doc.addImage(chart1DataURL, "JPEG", marginX, yOffset, doc.internal.pageSize.getWidth() - 2 * marginX, 200);
  
        if (yOffset + 240 > pageHeight) {
          doc.addPage();
          yOffset = marginY + 20;
        } else {
          yOffset += 240;
        }
  
        // Second chart
        doc.text("Factures Par Status", doc.internal.pageSize.getWidth() / 2, yOffset, { align: "center", underline: true });
        yOffset += sectionGap;
        doc.addImage(chart2DataURL, "JPEG", marginX + 90, yOffset, doc.internal.pageSize.getWidth() - 2 * (marginX + 80), 350);
  
        doc.save("Rapport_Tableau_de_Bord.pdf");
      } catch (error) {
        console.error("Error capturing charts:", error);
      }
    }, 250);
  };

  const columns = [
    {
      field: "_id",
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
            variant={isSmallScreen ? "h4" : "h2"}
            color={theme.palette.secondary[100]}
            fontWeight="bold"
            sx={{ mb: "5px" }}
          >
            TABLEAU DE BORD
          </Typography>
          <Typography variant={isSmallScreen ? "h6" : "h5"} color={theme.palette.secondary[300]}>
            Bienvenue sur votre tableau de bord
          </Typography>
        </Box>
        {/*{generateRapport ? ( */}
          <Box>
            <Button
              sx={{
                backgroundColor: theme.palette.secondary[400],
                color: theme.palette.secondary[50],
                fontSize: isSmallScreen ? "11px" : "14px",
                fontWeight: "bold",
                padding: isSmallScreen ? "8px 14px" : "10px 20px",
              }}
              onClick={generatePDF}
            >
              <DownloadOutlined sx={{ mr: "10px" }} />
              Télécharger Rapports
            </Button>
          </Box>
       {/* ) : (
          ""
        )} */}
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
          id="overview-chart"
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }} pl={3}>
          Ventes réussites réalisées cette année ( DHs )
          </Typography>
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
              overflowX: isSmallScreen ? "auto" : "hidden",
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
          <BreakdownChart idBreakDownChart="breakdown-chart" />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Répartition des factures et des informations par status de revenus
            réalisés et ventes totales.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
