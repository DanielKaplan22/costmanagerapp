import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/nav_bar.jsx";
import AddCostForm from "./components/add_cost_form.jsx";
import ReportPage from "./components/report_page.jsx";
import HomePage from "./components/home_page.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />{" "}
        <Route path="/add-cost" element={<AddCostForm />} />
        <Route path="/reports" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
