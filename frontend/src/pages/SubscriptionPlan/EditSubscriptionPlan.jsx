import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetOneSubscriptionQuery,
  useUpdateSubscriptionMutation,
  useGetOneEntrepriseQuery,
  useGetPacksQuery,
} from "state/api";
import Header from "componentsAdmin/Header";

const EditSubscription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    packId: "",
    startDate: "",
    endDate: "",
    status: "",
    price: 0,
  });
  const { data, isLoading, isError } = useGetOneSubscriptionQuery(id);
  const [updateSubscription, { isLoading: isUpdating }] =
    useUpdateSubscriptionMutation();

  useEffect(() => {
    if (data) {
      setFormData({
        userId: data.userId,
        packId: data.packId,
        startDate: formatDate(data.startDate),
        endDate: formatDate(data.endDate),
        status: data.status,
        price: data.price,
      });
    }
  }, [data]);

  const { data: packs } = useGetPacksQuery();
  const { data: entreprise } = useGetOneEntrepriseQuery(formData.userId);
  console.log("entreprise : ", entreprise);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSubscription({ id, SubscriptionData: formData });
      navigate("/subscriptionsplans");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePackChange = (event) => {
    setFormData({ ...formatDate, packId: event.target.value });
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography>Error loading subscription data</Typography>;

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Edit Subscription" subtitle="Edit subscription details" />
      <form onSubmit={handleSubmit}>
        <TextField
          
          variant="outlined"
          type="text"
          value={entreprise.name}
          disabled
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="packs-label">Pack</InputLabel>
          <Select
          variant="outlined"
          type="text"
          fullWidth
          margin="normal"
            labelId="packs-label"
            id="pack-select"
            value={formData.packId}
            onChange={handlePackChange}
            renderValue={(selected) => (
              <div >
                {selected && (
                  <Typography key={selected}
                  >
                    {packs.find((pack) => pack._id === selected)?.name || ""}
                  </Typography>
                    
                )}
              </div>
            )}
          >
            {packs &&
              packs.map((pack) => (
                <MenuItem key={pack._id} value={pack._id}>
                  {pack.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          name="startDate"
          label="Start Date"
          variant="outlined"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="endDate"
          label="End Date"
          variant="outlined"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="status"
          label="Status"
          variant="outlined"
          value={formData.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
          select
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="expired">Expired</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isUpdating}
        >
          {isUpdating ? <CircularProgress size={24} /> : "Update of subscription"}
        </Button>
      </form>
    </Box>
  );
};

export default EditSubscription;
