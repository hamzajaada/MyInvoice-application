import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  useTheme,
  Avatar,
  Input,
} from "@mui/material";
import {
  useUpdateEntrepriseMutation,
  useChangePasswordEntrepriseMutation,
} from "state/api";
import Header from "componentsAdmin/Header";
import axios from "axios";

const Profil = () => {
  
  const navigate = useNavigate();
  const id = localStorage.getItem("userId");
  if (!id) {
    navigate("/");
  }
  const theme = useTheme();
  const [enterpriseDetails, setEnterpriseDetails] = useState(null);
  const [changePassword] = useChangePasswordEntrepriseMutation(id);
  const [enterpriseMotPasse, setEnterpriseMotPasse] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [logo, setLogo] = useState(null);
  const [signature, setSignature] = useState(null);
  const [updateEntreprise] = useUpdateEntrepriseMutation();
  // const [Profil, setProfil] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // hadi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Api/Entreprise/entreprisedetail/${id}`);
        setEnterpriseDetails(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      navigate("/");
    }
  }, [id, navigate]); 
   
 


  if (isLoading || !enterpriseDetails) {
    return <Typography>Loading...</Typography>;
  }

  const handleFieldChange = (field, value) => {
    setEnterpriseDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleFieldPasswordChange = (field, value) => {
    setEnterpriseMotPasse((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    console.log("Détails de l'entreprise modifiés :", enterpriseDetails); 
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", enterpriseDetails.name);
      formData.append("email", enterpriseDetails.email);
      formData.append("phone", enterpriseDetails.phone);
      formData.append("address", enterpriseDetails.address);
      if (logo) {
        formData.append("logo", logo);
      }
      const id = localStorage.getItem("userId");
      await updateEntreprise({ id, entreprise: formData });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    console.log("Mot de passe de l'entreprise modifié :", enterpriseMotPasse);
    try {
      if (enterpriseMotPasse.newPassword === enterpriseMotPasse.confirmPassword) {
        const { data, error } = await changePassword({
          id,
          oldPassword: enterpriseMotPasse.oldPassword,
          newPassword: enterpriseMotPasse.newPassword,
        });
        if (data) {
          console.log("Message :", data.message);
          if (data.message === "Password changed successfully") {
            localStorage.removeItem("userId");
            localStorage.removeItem("token");
            navigate("/");
          } else {
            console.log("Message :", data.message);
          }
        } else if (error) {
          console.log("Erreur :", error);
        }
      } else {
        console.log("Passwords don't match");
      }
    } catch (err) {
      console.log("Erreur :", err);
    }
  };

  const handleIconChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSignatureChange = (e) => {
    setSignature(e.target.files[0]);
  };

  const handleSignatureUpload = async () => {
    if (!signature) {
      console.log("No signature file selected");
      return;
    }
    const formData = new FormData();
    formData.append("signature", signature);

    try {
      const response = await axios.put(`http://localhost:3001/Api/Entreprise/uploadSignature/${id}`, formData);
      setEnterpriseDetails((prevDetails) => ({
        ...prevDetails,
        signature: response.data.signature,
      }));
      console.log("Signature uploaded successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading signature:", error);
    }
  };


  return (
    <Box m="2rem 2.5rem">
      <Header
        title="Entreprise Detail"
        subtitle="Les détails de l'entreprise"
      />
      <Typography marginTop={"20px"}>
        Les informations générale de compte
      </Typography>
      <Box
        fullWidth
        border={`1px solid ${theme.palette.primary.main}`}
        margin="normal"
        borderRadius="0.5rem"
        p="1rem"
      >
        <form
          onSubmit={handleSubmit}
          sx={{
            mt: "2rem",
            backgroundImage: "none",
            backgroundColor: theme.palette.background.alt,
            borderRadius: "0.55rem",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={`${enterpriseDetails.logo.url}`}
              alt={enterpriseDetails.name}
              sx={{ width: 70, height: 70 }}
            />
            <Box ml={2}>
              <Input
                id="icon-input"
                type="file"
                name="logo"
                fullWidth
                onChange={handleIconChange}
                accept="image/*"
              />
            </Box>
          </Box>
          <TextField
            label="Nom d'entreprise"
            variant="outlined"
            fullWidth
            value={enterpriseDetails.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            margin="normal"
          />
          <TextField
            label="Email d'entreprise"
            variant="outlined"
            fullWidth
            value={enterpriseDetails.email}
            margin="normal"
            onChange={(e) => handleFieldChange("email", e.target.value)}
          />
          <TextField
            label="Numéro de téléphone d'entreprise"
            variant="outlined"
            fullWidth
            value={enterpriseDetails.phone}
            margin="normal"
            onChange={(e) => handleFieldChange("phone", e.target.value)}
          />
          <TextField
            label="Adresse d'entreprise"
            variant="outlined"
            fullWidth
            value={enterpriseDetails.address}
            margin="normal"
            onChange={(e) => handleFieldChange("address", e.target.value)}
          />
          <TextField
            label="Pack d'entreprise"
            variant="outlined"
            fullWidth
            value={enterpriseDetails.pack}
            margin="normal"
            disabled
          />
          <TextField
            label="Prix de pack d'entreprise"
            variant="outlined"
            fullWidth
            value={enterpriseDetails.price}
            margin="normal"
            disabled
          />
          <TextField
            label="la date de start d'abonnenent d'entreprise"
            variant="outlined"
            fullWidth
            value={enterpriseDetails.subscriptionStartDate}
            margin="normal"
            disabled
          />
          <TextField
            label="la date de fin d'abonnenent d'entreprise"
            variant="outlined"
            fullWidth
            value={enterpriseDetails.subscriptionEndDate}
            margin="normal"
            disabled
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Modifier
            </Button>
          </Box>
        </form>
      </Box>
      <Typography marginTop={"20px"}>Changement de mot de passe</Typography>
      <Box
        fullWidth
        border={`1px solid ${theme.palette.primary.main}`}
        margin="normal"
        borderRadius="0.5rem"
        p="1rem"
      >
        <form
          onSubmit={handleChangePassword}
          sx={{
            mt: "2rem",
            backgroundImage: "none",
            backgroundColor: theme.palette.background.alt,
            borderRadius: "0.55rem",
          }}
        >
          <TextField
            label="Mot de passe actuelle"
            variant="outlined"
            fullWidth
            name="password"
            type="password"
            margin="normal"
            onChange={(e) =>
              handleFieldPasswordChange("oldPassword", e.target.value)
            }
          />
          <TextField
            label="Nouveau mot de passe"
            variant="outlined"
            fullWidth
            name="passwordConf"
            type="password"
            margin="normal"
            onChange={(e) =>
              handleFieldPasswordChange("newPassword", e.target.value)
            }
          />
          <TextField
            label="Confirmation de mot de pass"
            variant="outlined"
            fullWidth
            name="passwordNew"
            type="password"
            margin="normal"
            onChange={(e) =>
              handleFieldPasswordChange("confirmPassword", e.target.value)
            }
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Modifier
            </Button>
          </Box>
        </form>
      </Box>
      <Typography marginTop={"20px"}>Importer votre signature</Typography>
      <Box
        fullWidth
        border={`1px solid ${theme.palette.primary.main}`}
        margin="normal"
        borderRadius="0.5rem"
        p="1rem"
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={`http://localhost:3001/Images/${enterpriseDetails.signature}`}
            alt="Signature"
            sx={{ width: 70, height: 70 }}
          />
          <Box ml={2}>
            <Input
              id="signature-input"
              type="file"
              name="signature"
              fullWidth
              onChange={handleSignatureChange}
              accept="image/*"
            />
          </Box>
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSignatureUpload}>
            Modifier
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Profil;
