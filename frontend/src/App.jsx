import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import Transactions from "./pages/transactions/Transactions";
import BehavioralAnalytics from "./pages/behavioral/BehavioralAnalytics";
import WealthStability from "./pages/wealth/WealthStability";
import Archive from "./pages/archive/Archive";
import Goals from "./pages/goals/Goals";
import Settings from "./pages/settings/Settings";
import Pricing from "./pages/pricing/Pricing";
import ChatbotWidget from "./components/ChatbotWidget";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<><Dashboard /><ChatbotWidget /></>} />
        <Route path="/transactions" element={<><Transactions /><ChatbotWidget /></>} />
        <Route path="/analytics" element={<><BehavioralAnalytics /><ChatbotWidget /></>} />
        <Route path="/wealth" element={<><WealthStability /><ChatbotWidget /></>} />
        <Route path="/archive" element={<><Archive /><ChatbotWidget /></>} />
        <Route path="/goals" element={<><Goals /><ChatbotWidget /></>} />
        <Route path="/settings" element={<><Settings /><ChatbotWidget /></>} />
        <Route path="/pricing" element={<><Pricing /><ChatbotWidget /></>} />
      </Route>
    </Routes>
  );
}

export default App;
