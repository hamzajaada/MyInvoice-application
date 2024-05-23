import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  useTheme,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import Header from "componentsAdmin/Header";
import { Link } from "react-router-dom";
import FlexBetween from "componentsAdmin/FlexBetween";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUpdatePackActiveMutation } from "state/api";
import { toast } from "react-toastify";

const Pack = ({
  _id,
  name,
  description,
  services,
  price,
  handleDelete, 
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          ${Number(price).toFixed(2)}
        </Typography>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          Voir plus
        </Button>
        <Button
          variant="primary"
          size="small"
          component={Link}
          to={`/Pack/edit/${_id}`}
        >
          Modifier
        </Button>
        <Button
          variant="primary"
          size="small"
          onClick={() => handleDelete(_id)} 
        >
          Supprimer
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
          <Typography>Services:</Typography>
          <List dense>
            {services.map((service, index) => (
              <ListItem key={index}>
                <ListItemText primary={service.serviceId.ServiceName} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Packs = () => {
  const [packs, setPacks] = useState([]);
  // const navigate = useNavigate();
  const [updatePack] = useUpdatePackActiveMutation();

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Api/Pack/");
        setPacks(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPacks();
  }, []);

  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  const handleDelete = async (id) => {
    try {
      const thisPack = packs.find((pack) => pack._id === id);
      if (thisPack) {
        thisPack.active = false;
        const {data} = await updatePack({ id, pack: thisPack });
        if(data.success) {
          toast.success("La suppresion de pack se passe correctement");
          setPacks(packs.filter((pack) => pack._id !== id));
        } else {
          toast.error("La suppresion de pack ne s'est pas passé correctement");
        }
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="PACKS" subtitle="Liste de packs." />
        <Link to="/Pack/new">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddOutlinedIcon />}
            sx={{ mt: 3, mb: 2 }}
          >
            Ajoute de pack
          </Button>
        </Link>
      </FlexBetween>
      {packs.length > 0 ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(3, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {packs.map(
            ({
              _id,
              name,
              description,
              services,
              price,
            }) => (
              <Pack
                key={_id}
                _id={_id}
                name={name}
                description={description}
                price={price}
                services={services}
                handleDelete={handleDelete} // Passer la fonction de suppression
              />
            )
          )}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Packs;

