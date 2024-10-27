import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getUsers,
} from "../api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState({
    nombre: "",
    descripcion: "",
    fechaInicio: null,
    fechaFin: null,
    liderId: null,
  });
  const [users, setUsers] = useState([]);
  const toast = React.useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch projects when the component mounts
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        setProjects(response.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();

    // Fetch users to populate the leader dropdown
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Handle project creation or update
  const handleSaveProject = async () => {
    const formattedProject = {
      ...newProject,
      fechaInicio: newProject.fechaInicio
        ? newProject.fechaInicio.toISOString().split("T")[0]
        : null,
      fechaFin: newProject.fechaFin
        ? newProject.fechaFin.toISOString().split("T")[0]
        : null,
    };

    try {
      if (editMode) {
        await updateProject(selectedProject.id, formattedProject);
        setProjects(
          projects.map((proj) =>
            proj.id === selectedProject.id ? formattedProject : proj
          )
        );
        toast.current.show({
          severity: "success",
          summary: "Proyecto actualizado",
          detail: "El proyecto se actualizó exitosamente",
          life: 3000,
        });
      } else {
        await createProject(formattedProject);
        setProjects([...projects, formattedProject]);
        toast.current.show({
          severity: "success",
          summary: "Proyecto creado",
          detail: "El proyecto se creó exitosamente",
          life: 3000,
        });
      }
      setShowDialog(false);
      setNewProject({
        nombre: "",
        descripcion: "",
        fechaInicio: null,
        fechaFin: null,
        liderId: null,
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el proyecto",
        life: 3000,
      });
    }
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter((proj) => proj.id !== projectId));
      toast.current.show({
        severity: "success",
        summary: "Proyecto eliminado",
        detail: "El proyecto se eliminó exitosamente",
        life: 3000,
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el proyecto",
        life: 3000,
      });
    }
  };

  // Open dialog for editing a project
  const editProject = (project) => {
    setEditMode(true);
    setSelectedProject(project);
    setNewProject({
      ...project,
      fechaInicio: new Date(project.fechaInicio),
      fechaFin: new Date(project.fechaFin),
    });
    setShowDialog(true);
  };

  // Navigate to Project Details Page
  const viewProjectDetails = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="p-m-4">
      <Toast ref={toast} />
      <div className="p-d-flex p-jc-between p-ai-center p-mb-4">
        <Button
          label="Crear Proyecto"
          className="p-button-success"
          onClick={() => {
            setEditMode(false);
            setShowDialog(true);
          }}
        />
      </div>

      <DataTable
        value={projects}
        paginator
        rows={10}
        loading={loading}
        className="p-datatable-sm mt-5"
      >
        <Column field="nombre" header="Nombre del Proyecto" sortable></Column>
        {/* <Column field="descripcion" header="Descripción" sortable></Column> */}
        <Column field="fechaInicio" header="Fecha de Inicio" sortable></Column>
        <Column field="fechaFin" header="Fecha de Fin" sortable></Column>
        <Column
          field="liderId"
          header="Líder del Proyecto"
          body={(rowData) => {
            const lider = users.find((user) => user.id === rowData.liderId);
            return lider ? lider.nombre : "No asignado";
          }}
          sortable
        ></Column>
        <Column
          header="Acciones"
          body={(rowData) => (
            <div className="p-d-flex p-ai-center">
              <Button
                label="Editar"
                className="p-button-text p-button-warning"
                onClick={() => editProject(rowData)}
              />
              <Button
                label="Ver"
                className="p-button-text p-button-info"
                onClick={() => viewProjectDetails(rowData.id)}
              />
              <Button
                label="Eliminar"
                className="p-button-text p-button-danger"
                onClick={() => handleDeleteProject(rowData.id)}
              />
            </div>
          )}
        ></Column>
      </DataTable>

      <Dialog
        header={editMode ? "Editar Proyecto" : "Crear Proyecto"}
        visible={showDialog}
        style={{ width: "50vw" }}
        footer={
          <div>
            <Button
              label="Cancelar"
              className="p-button-text"
              onClick={() => setShowDialog(false)}
            />
            <Button
              label={editMode ? "Actualizar" : "Crear"}
              className="p-button-primary"
              onClick={handleSaveProject}
            />
          </div>
        }
        onHide={() => setShowDialog(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="nombre">Nombre del Proyecto</label>
            <InputText
              id="nombre"
              value={newProject.nombre}
              onChange={(e) =>
                setNewProject({ ...newProject, nombre: e.target.value })
              }
            />
          </div>
          <div className="p-field mt-3">
            <label htmlFor="descripcion">Descripción</label>
            <InputTextarea
              id="descripcion"
              value={newProject.descripcion}
              onChange={(e) =>
                setNewProject({ ...newProject, descripcion: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="p-field mt-3">
            <label htmlFor="fechaInicio">Fecha de Inicio</label>
            <Calendar
              id="fechaInicio"
              value={newProject.fechaInicio}
              onChange={(e) =>
                setNewProject({ ...newProject, fechaInicio: e.value })
              }
              dateFormat="yy-mm-dd"
              showIcon
            />
          </div>
          <div className="p-field mt-3">
            <label htmlFor="fechaFin">Fecha de Fin</label>
            <Calendar
              id="fechaFin"
              value={newProject.fechaFin}
              onChange={(e) =>
                setNewProject({ ...newProject, fechaFin: e.value })
              }
              dateFormat="yy-mm-dd"
              showIcon
            />
          </div>
          <div className="p-field mt-3">
            <label htmlFor="liderId">Líder del Proyecto</label>
            <Dropdown
              id="liderId"
              value={newProject.liderId}
              options={users}
              onChange={(e) =>
                setNewProject({ ...newProject, liderId: e.value.id })
              }
              optionLabel="nombre"
              placeholder="Seleccione un líder"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ProjectPage;
