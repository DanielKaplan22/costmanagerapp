import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar sx={{ height: 80 }}>
        <Typography variant="h4" sx={{ flexGrow: 1, color: "#000" }}>
          Cost Manager app
        </Typography>
        <Button variant="h1" color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button variant="h1" color="inherit" component={Link} to="/add-cost">
          Add Cost
        </Button>
        <Button variant="h1" color="inherit" component={Link} to="/reports">
          Report
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
