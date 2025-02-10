import { Container, Typography } from "@mui/material";

function HomePage() {
  return (
    <Container maxWidth="md" sx={{ mt: 20, textAlign: "left" }}>
      <Typography variant="h3" gutterBottom>
        Welcome to your Cost Manager
      </Typography>
      <Typography variant="h5" color="textSecondary">
        O Easily track your expenses
      </Typography>
      <Typography variant="h5" color="textSecondary">
        O Manage your budget
      </Typography>
      <Typography variant="h5" color="textSecondary">
        O Gain insights into your spending habits
      </Typography>
    </Container>
  );
}

export default HomePage;
