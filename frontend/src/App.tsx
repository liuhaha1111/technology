import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PublicHome from './pages/PublicHome';
import Dashboard from './pages/Dashboard';
import ProjectDeclaration from './pages/ProjectDeclaration';
import ProjectApproval from './pages/ProjectApproval';
import MidtermInspection from './pages/MidtermInspection';
import TechReport from './pages/TechReport';
import ProjectAcceptance from './pages/ProjectAcceptance';
import UserManagement from './pages/UserManagement';
import ExpertManagement from './pages/ExpertManagement';
import ContractManagement from './pages/ContractManagement';
import FundAdjustment from './pages/FundAdjustment';
import UnitAdjustment from './pages/UnitAdjustment';
import ExtensionApplication from './pages/ExtensionApplication';
import TerminationRevocation from './pages/TerminationRevocation';
import RecordSystem from './pages/RecordSystem';
import AchievementEvaluation from './pages/AchievementEvaluation';
import IntegrityReview from './pages/IntegrityReview';
import UnitDashboard from './pages/UnitDashboard';
import RequirePortalAuth from './components/RequirePortalAuth';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route
          path="/unit"
          element={(
            <RequirePortalAuth>
              <UnitDashboard />
            </RequirePortalAuth>
          )}
        />
        <Route
          path="/app"
          element={(
            <RequirePortalAuth>
              <Layout />
            </RequirePortalAuth>
          )}
        >
          <Route index element={<Dashboard />} />
          <Route path="declaration" element={<ProjectDeclaration />} />
          <Route path="approval" element={<ProjectApproval />} />
          <Route path="midterm" element={<MidtermInspection />} />
          <Route path="tech-report" element={<TechReport />} />
          <Route path="acceptance" element={<ProjectAcceptance />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="experts" element={<ExpertManagement />} />
          <Route path="contracts" element={<ContractManagement />} />
          <Route path="fund-adjustment" element={<FundAdjustment />} />
          <Route path="unit-adjustment" element={<UnitAdjustment />} />
          <Route path="extension" element={<ExtensionApplication />} />
          <Route path="termination" element={<TerminationRevocation />} />
          <Route path="record" element={<RecordSystem />} />
          <Route path="evaluation" element={<AchievementEvaluation />} />
          <Route path="integrity" element={<IntegrityReview />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
