import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Transactions from "./pages/transactions/Transactions";
import BehavioralAnalytics from "./pages/behavioral/BehavioralAnalytics";
import ImpulseLab from "./pages/impulse/ImpulseLab";
import WealthStability from "./pages/wealth/WealthStability";
import Archive from "./pages/archive/Archive";
import Goals from "./pages/goals/Goals";
import Settings from "./pages/settings/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/analytics" element={<BehavioralAnalytics />} />
      <Route path="/impulse-ai" element={<ImpulseLab />} />
      <Route path="/wealth" element={<WealthStability />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
