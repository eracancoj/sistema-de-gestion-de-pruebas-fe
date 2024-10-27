import React, { useEffect, useState } from "react";
import { getProjects, deleteProject } from "../api";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await getProjects();
      setProjects(response.data);
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    await deleteProject(id);
    setProjects(projects.filter((project) => project.id !== id));
  };

  console.log(projects);

  return (
    <div>
      <h1>Lista de Proyectos</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.nombre} (Inicio: {project.fechaInicio}, Fin:{" "}
            {project.fechaFin})
            <button onClick={() => handleDelete(project.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
