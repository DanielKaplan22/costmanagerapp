import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  IconButton,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import PieChart from "./pie_chart";
import {
  getExpensesByMonthYear,
  deleteExpense,
  updateExpense,
} from "../utils/idb";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function ReportPage() {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [editExpense, setEditExpense] = useState(null);

  useEffect(() => {
    async function fetchExpenses() {
      let data;
      if (selectedMonth && selectedYear) {
        data = await getExpensesByMonthYear(
          Number(selectedMonth),
          Number(selectedYear)
        );
      } else if (selectedYear) {
        data = await getExpensesByMonthYear(null, Number(selectedYear));
      } else if (selectedMonth) {
        data = await getExpensesByMonthYear(Number(selectedMonth), null);
      } else {
        data = await getExpensesByMonthYear();
      }
      setExpenses(data);
    }
    fetchExpenses();
  }, [selectedMonth, selectedYear]);

  const handleDelete = async (id) => {
    await deleteExpense(id);
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleResetFilters = () => {
    setSelectedMonth("");
    setSelectedYear("");
  };

  const handleEdit = (expense) => {
    setEditExpense({ ...expense, date: dayjs(expense.date) }); // Ensure it's a copy and convert date
  };

  const handleSaveEdit = async () => {
    if (!editExpense) return;
    const updatedExpense = {
      ...editExpense,
      date: editExpense.date.toISOString(),
    };
    await updateExpense(updatedExpense);
    setExpenses(
      expenses.map((expense) =>
        expense.id === editExpense.id ? updatedExpense : expense
      )
    );
    setEditExpense(null);
  };

  const totalSum = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 4, p: 3, bgcolor: "#f9f9f9", borderRadius: 2 }}
    >
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        Expense Report
      </Typography>

      {/* Month & Year Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <FormControl fullWidth>
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            label="Month"
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <MenuItem value="">All Months</MenuItem>
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            label="Year"
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <MenuItem value="">All Years</MenuItem>
            {Array.from({ length: 5 }, (_, i) => (
              <MenuItem key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Reset Filters Button */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleResetFilters}
        >
          Reset Filters
        </Button>
      </div>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                Amount
              </TableCell>
              <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                Category
              </TableCell>
              <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                Description
              </TableCell>
              <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                Date
              </TableCell>
              <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell sx={{ textAlign: "center" }}>
                  ${expense.amount}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {expense.category}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {expense.description}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(expense)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(expense.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {/* Add Total Sum Row */}
            {expenses.length > 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{ fontWeight: "bold", textAlign: "left" }}
                >
                  Total: {totalSum.toFixed(2)}$
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pie Chart */}
      <PieChart expenses={expenses} />

      {/* Edit Expense Dialog */}
      {editExpense && (
        <Dialog open={true} onClose={() => setEditExpense(null)}>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogContent>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={editExpense.amount}
              onChange={(e) =>
                setEditExpense({
                  ...editExpense,
                  amount: parseFloat(e.target.value),
                })
              }
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={editExpense.category}
                onChange={(e) =>
                  setEditExpense({ ...editExpense, category: e.target.value })
                }
              >
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Rent">Rent</MenuItem>
                <MenuItem value="Transport">Transport</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Description"
              fullWidth
              value={editExpense.description}
              onChange={(e) =>
                setEditExpense({ ...editExpense, description: e.target.value })
              }
              sx={{ mt: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={editExpense.date}
                onChange={(newDate) =>
                  setEditExpense({ ...editExpense, date: newDate })
                }
                sx={{ mt: 2, width: "100%" }}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditExpense(null)}>Cancel</Button>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}

export default ReportPage;
