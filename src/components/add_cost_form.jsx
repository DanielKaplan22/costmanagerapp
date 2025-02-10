import { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Container,
  Typography,
  Grid2,
} from "@mui/material";
import { addExpense } from "../utils/idb"; // IndexedDB function
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function AddCostForm() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);

  const handleSubmit = async () => {
    if (!amount || !category || !date) return alert("Please enter all details");

    const newExpense = {
      amount: parseFloat(amount),
      category,
      description,
      date: date.toISOString(),
    };

    await addExpense(newExpense); // Save to IndexedDB
    alert("Expense added!");

    // Reset form fields after submission
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(dayjs(setDate(null))); // Reset to today's date
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 10,
        p: 10,
        bgcolor: "#8aeff5",
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        Add New Cost Item
      </Typography>

      <Grid2 size={{ xs: 5, md: 5 }} container spacing={4}>
        {/* Amount Input */}
        <Grid2 item xs={12}>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{
              bgcolor: "#fff",
              color: "#000",
            }}
          />
        </Grid2>

        {/* Category Selector */}
        <Grid2 size={{ xs: 5, md: 5 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              sx={{
                bgcolor: "#fff",
                color: "#000",
              }}
            >
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Rent">Rent</MenuItem>
              <MenuItem value="Transport">Transport</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid2>

        {/* Date Picker */}
        <Grid2 size={{ xs: 5, md: 5 }} container spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              sx={{
                bgcolor: "#fff",
                color: "#000",
              }}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid2>

        {/* Description Input */}
        <Grid2 size={{ xs: 5, md: 5 }} container spacing={2}>
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              bgcolor: "#fff",
              color: "#000",
            }}
          />
        </Grid2>

        {/* Submit Button */}
        <Grid2 item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Save Cost
          </Button>
        </Grid2>
      </Grid2>
    </Container>
  );
}

export default AddCostForm;
