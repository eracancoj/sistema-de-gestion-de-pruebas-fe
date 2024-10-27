import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import Auth from "./components/Auth";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Tema (puedes elegir otros)
import "primereact/resources/primereact.min.css"; // Componentes CSS de PrimeReact
import "primeicons/primeicons.css"; // Iconos de PrimeIcons
import "primeflex/primeflex.css"; // Utilidades CSS de PrimeFlex
import ProjectPage from "./pages/ProjectPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import TestCasesPage from "./pages/TestCasesPage";
import DefectsPage from "./pages/DefectsPage";
import ReportPage from "./pages/ReportPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <Auth>
                <DashboardPage />
              </Auth>
            }
          />
          <Route
            path="/projects"
            element={
              <Auth>
                <ProjectPage />
              </Auth>
            }
          />
          <Route
            path="/projects/:projectId"
            element={
              <Auth>
                <ProjectDetailsPage />
              </Auth>
            }
          />
          <Route
            path="/test-plans/:testPlanId/test-cases"
            element={
              <Auth>
                <TestCasesPage />
              </Auth>
            }
          />
          <Route
            path="/test-cases/:testCaseId/defects"
            element={
              <Auth>
                <DefectsPage />
              </Auth>
            }
          />
                    <Route
            path="/reports"
            element={
              <Auth>
                <ReportPage />
              </Auth>
            }
          />
        </Route>

        {/* Agrega aquí otras páginas protegidas dentro del componente Auth */}
      </Routes>
    </Router>
  );
};

export default App;
