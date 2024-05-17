import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
} from "@mui/icons-material";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import profileImage from "assets/logo-removebg-preview.png";
import TryIcon from "@mui/icons-material/Try";
import { Link } from "react-router-dom";
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';

const navItems = [
  {
    text: "Tableau de bord",
    title: "dashboardClient",
    icon: <HomeOutlined />,
  },
  {
    text: "Côté Client",
    title: "",
    icon: null,
  },
  {
    text: "Documents",
    title: "",
    icon: <ReceiptLongOutlined />,
    subMenu: [
      { text: "Facture", title: "factures" },
      { text: "Bon de livraison", title: "bon-livraison" },
      { text: "Bon de commandes", title: "bon-commandes" },
      { text: "Devis", title: "devis" },
    ],
  },
  {
    text: "Tax",
    title: "Taks",
    icon: <PaidOutlinedIcon />,
  },
  {
    text: "Produits",
    title: "produits",
    icon: <ShoppingCartOutlined />,
  },
  {
    text: "Categories",
    title: "categories",
    icon: <CategoryOutlinedIcon />,
  },
  {
    text: "Clients",
    title: "clients",
    icon: <Groups2Outlined />,
  },
  {
    text: "Fournisseurs",
    title: "fournisseurs",
    icon: <Groups2Outlined />,
  },
  {
    text: "Ventes",
    title: "",
    icon: null,
  },
  {
    text: "Apercu",
    title: "apercu",
    icon: <PointOfSaleOutlined />,
  },
  {
    text: "Quotidien",
    title: "quotidien",
    icon: <TodayOutlined />,
  },
  {
    text: "Mensuel",
    title: "mensuel",
    icon: <CalendarMonthOutlined />,
  },
  {
    text: "Paramètres",
    title: "",
    icon: null,
  },
  {
    text: "Demande",
    title: "add-demande",
    icon: <TryIcon />,
  },
  {
    text: "Profil",
    title: "profil",
    icon: <AdminPanelSettingsOutlined />,
  },
];

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const userName = localStorage.getItem('userName');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  // État pour suivre l'ouverture des sous-menus
  const [subMenuOpen, setSubMenuOpen] = useState({});

  // Fonction pour basculer l'état d'ouverture d'un sous-menu
  const toggleSubMenu = (title) => {
    setSubMenuOpen((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Link to="/">
                    <Box
                      component="img"
                      alt="profile"
                      src={profileImage}
                      height="100px"
                      width="160px"
                      sx={{ objectFit: "cover" }}
                    />
                  </Link>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon, title, subMenu }) => {
                if (!icon) {
                  return (
                    <Typography
                      key={text}
                      sx={{ m: "2.25rem 0 1rem 3.25rem", fontWeight: "bold" }}
                    >
                      {text}
                    </Typography>
                  );
                }
                const lcTitle = title.toLowerCase();

                return (
                  <div key={text}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          if (subMenu) {
                            toggleSubMenu(title);
                            setActive(subMenu[0].title);
                          } else {
                            navigate(`/${userName}/${lcTitle}`);
                            setActive(lcTitle);
                          }
                        }}
                        sx={{
                          backgroundColor:
                            active === lcTitle
                              ? theme.palette.secondary[400]
                              : "transparent",
                          color:
                            active === lcTitle
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[100],
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            ml: "1rem",
                            color:
                              active === lcTitle
                                ? theme.palette.primary[600]
                                : theme.palette.secondary[200],
                          }}
                        >
                          {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                        {subMenu && subMenuOpen[title] && (
                          <ChevronRightOutlined sx={{ ml: "auto" }} />
                        )}
                      </ListItemButton>
                    </ListItem>
                    {subMenu && subMenuOpen[title] && (
                      <List>
                        {subMenu.map(({ text: subText, title: subTitle }) => (
                          <ListItem
                            key={subText}
                            disablePadding
                            sx={{ pl: 4, py: 0.5 }}
                          >
                            <ListItemButton
                              onClick={() => {
                                navigate(`/${userName}/${subTitle}`);
                              }}
                              sx={{
                                backgroundColor:
                                  active === subTitle
                                    ? theme.palette.secondary[400]
                                    : "transparent",
                                color:
                                  active === subTitle
                                    ? theme.palette.primary[600]
                                    : theme.palette.secondary[100],
                              }}
                            >
                              <ListItemText primary={subText} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </div>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
