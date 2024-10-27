import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = React.useRef(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({
        nombre: email,
        contrasena: password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error al iniciar sesión",
        detail: "Verifique sus credenciales.",
        life: 3000,
      });
    }
  };

  return (
    <div
      className="p-d-flex p-jc-center p-ai-center bg-teal-100"
      style={{ height: "100vh" }}
    >
      <Toast ref={toast} />
      <Card
        title="Sistema de Gestión de Pruebas"
        className="p-shadow-5 ml-8"
        style={{ width: "25rem", padding: "10rem 0 5rem 0" }}
      >
        <form onSubmit={handleLogin} className="p-fluid">
          <div className="p-field">
            <label htmlFor="email">Usuario:</label>
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="p-field mt-3">
            <label htmlFor="password">Contraseña:</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              required
            />
          </div>
          <Button
            type="submit"
            label="Iniciar Sesión"
            className="p-button-primary mt-5"
          />
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
