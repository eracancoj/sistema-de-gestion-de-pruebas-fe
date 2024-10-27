import React, { useState, useEffect } from "react";
import { getProjects, createProject, getUsers } from "../api";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    nombre: "",
    descripcion: "",
    fechaInicio: null,
    fechaFin: null,
    liderId: null,
  });
  const [users, setUsers] = useState([]);
  const toast = React.useRef(null);

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
  }, []);

  useEffect(() => {
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

  // Handle project creation
  const handleCreateProject = async () => {
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
      await createProject(formattedProject);
      setProjects([...projects, formattedProject]);
      setShowDialog(false);
      toast.current.show({
        severity: "success",
        summary: "Proyecto creado",
        detail: "El proyecto se creó exitosamente",
        life: 3000,
      });
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
        detail: "No se pudo crear el proyecto",
        life: 3000,
      });
    }
  };

  // Dynamic tag based on project status
  const statusTemplate = (rowData) => {
    return (
      <Tag
        severity={rowData.status === "Completed" ? "success" : "warning"}
        value={rowData.status}
      />
    );
  };

  // Progress bar for each project
  const progressTemplate = (rowData) => {
    return (
      <ProgressBar
        value={rowData.progress}
        showValue={false}
        style={{ height: "10px" }}
      />
    );
  };

  return (
    <div className="p-m-4">
      <Card className="p-mt-4 mt-5" title="Proyectos Actuales">
        {loading ? (
          <p>Cargando proyectos...</p>
        ) : (
          <DataTable
            value={projects}
            paginator
            rows={5}
            className="p-datatable-sm"
          >
            <Column
              field="nombre"
              header="Nombre del Proyecto"
              sortable
            ></Column>
            <Column
              field="status"
              header="Estado"
              body={statusTemplate}
              sortable
            ></Column>
            <Column
              field="progress"
              header="Progreso"
              body={progressTemplate}
            ></Column>
            <Column field="liderId" header="Líder del Proyecto"></Column>
          </DataTable>
        )}
      </Card>

      <Dialog
        header="Crear Proyecto"
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
              label="Crear"
              className="p-button-primary"
              onClick={handleCreateProject}
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

export default DashboardPage;
