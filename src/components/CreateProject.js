import React, { useState } from "react";
import { createProject } from "../api";

const CreateProject = () => {
  const [project, setProject] = useState({
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProject(project);
    alert("Proyecto creado exitosamente");
    setProject({ nombre: "", fechaInicio: "", fechaFin: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nombre"
        value={project.nombre}
        onChange={handleChange}
        placeholder="Nombre del Proyecto"
        required
      />
      <input
        type="date"
        name="fechaInicio"
        value={project.fechaInicio}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="fechaFin"
        value={project.fechaFin}
        onChange={handleChange}
        required
      />
      <button type="submit">Crear Proyecto</button>
    </form>
  );
};

export default CreateProject;
