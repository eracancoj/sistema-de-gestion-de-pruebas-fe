import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { logout } from "../api";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // logout();
    navigate("/login");
  };

  return (
    <header
      className="flex justify-content-between p-shadow-2 p-d-flex p-jc-between p-ai-center p-p-3"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <h2 className="p-m-0">Sistema de Gestión de Pruebas</h2>
      <Button
        label="Cerrar Sesión"
        className="p-button-danger"
        onClick={handleLogout}
      />
    </header>
  );
};

export default Header;
