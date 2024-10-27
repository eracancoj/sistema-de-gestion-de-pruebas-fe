import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { PanelMenu } from "primereact/panelmenu";
import { Divider } from "primereact/divider";
import { logout } from "../api";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideLayout = location.pathname === "/login";

  const handleLogout = () => {
    // logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    {
      label: "Dashboard",
      command: () => navigate("/dashboard"),
    },
    {
      label: "Proyectos",
      command: () => navigate("/projects"),
    },
    {
      label: "Informes",
      command: () => navigate("/projects"),
    },
    {
      label: "Usuarios",
      command: () => navigate("/projects"),
    },
  ];

  if (hideLayout) {
    return <Outlet />;
  }

  return (
    <div className="app-container flex p-d-flex">
      <div
        className="layout-sidebar p-shadow-2 bg-teal-100 px-1"
        style={{ width: "250px", height: "100vh" }}
      >
        <div className="p-p-3">
          <h2 className="p-m-0 text-center">SGP</h2>
        </div>
        <Divider />
        <div className="p-p-3">
          <PanelMenu model={menuItems} style={{ width: "100%" }} />
        </div>
        <div
          className="p-p-3"
          style={{ position: "absolute", bottom: "20px", width: "100%" }}
        >
          <Button
            label="Cerrar Sesión"
            className="p-button-text"
            onClick={handleLogout}
          />
        </div>
      </div>
      <div
        className="layout-content"
        style={{ flex: 1, padding: "1rem", backgroundColor: "#f8f9fa" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
