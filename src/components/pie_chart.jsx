import { Pie } from "react-chartjs-2";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { InfoOutlined } from "@mui/icons-material";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Group expenses by category
function PieChart({ expenses }) {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // If there are no expenses, return null (do not render)
  if (Object.keys(categoryTotals).length === 0) {
    return (
      <Card sx={{ maxWidth: 400, margin: "auto", textAlign: "center", p: 2 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <InfoOutlined sx={{ fontSize: 40, color: "gray" }} /> {/* Icon */}
            <Typography variant="h6" color="textSecondary" sx={{ mt: 1 }}>
              No Data Available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Format data for the pie chart
  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Total Cost",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4caf50",
          "#ff9800",
        ],
        hoverOffset: 5,
      },
    ],
  };

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 3, p: 2 }}>
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          Expenses by Category
        </Typography>
        <Pie data={chartData} />
      </CardContent>
    </Card>
  );
}

export default PieChart;
