import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getTestCaseById,
  getDefects,
  createDefect,
  updateDefect,
  deleteDefect,
  getUsers,
} from "../api";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";

const DefectsPage = () => {
  const { testCaseId } = useParams();
  const [testCase, setTestCase] = useState(null);
  const [defects, setDefects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [newDefect, setNewDefect] = useState({
    descripcion: "",
    severidad: "Bajo",
    estado: "Abierto",
    asignadoA: null,
    fechaCreacion: null,
    fechaResolucion: null,
  });
  const toast = React.useRef(null);

  const severidadOptions = [
    { label: "Bajo", value: "Bajo" },
    { label: "Medio", value: "Medio" },
    { label: "Alto", value: "Alto" },
    { label: "Crítico", value: "Crítico" },
  ];

  const estadoOptions = [
    { label: "Abierto", value: "Abierto" },
    { label: "En Progreso", value: "En Progreso" },
    { label: "Resuelto", value: "Resuelto" },
    { label: "Cerrado", value: "Cerrado" },
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const testCaseResponse = await getTestCaseById(testCaseId);
        setTestCase(testCaseResponse.data);

        const defectsResponse = await getDefects();
        const associatedDefects = defectsResponse.data.filter(
          (defect) => defect.casoPruebaId === parseInt(testCaseId)
        );
        setDefects(associatedDefects);

        const usersResponse = await getUsers();
        setUsers(usersResponse.data);
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [testCaseId]);

  // Handle defect creation or update
  const handleSaveDefect = async () => {
    const formattedDefect = {
      ...newDefect,
      fechaCreacion: newDefect.fechaCreacion
        ? newDefect.fechaCreacion.toISOString().split("T")[0]
        : null,
      fechaResolucion: newDefect.fechaResolucion
        ? newDefect.fechaResolucion.toISOString().split("T")[0]
        : null,
      casoPruebaId: parseInt(testCaseId),
    };

    try {
      if (editMode) {
        await updateDefect(selectedDefect.id, formattedDefect);
        setDefects(
          defects.map((defect) =>
            defect.id === selectedDefect.id ? formattedDefect : defect
          )
        );
        toast.current.show({
          severity: "success",
          summary: "Defecto actualizado",
          detail: "El defecto se actualizó exitosamente",
          life: 3000,
        });
      } else {
        await createDefect(formattedDefect);
        setDefects([...defects, formattedDefect]);
        toast.current.show({
          severity: "success",
          summary: "Defecto creado",
          detail: "El defecto se creó exitosamente",
          life: 3000,
        });
      }
      setShowDialog(false);
      setNewDefect({
        descripcion: "",
        severidad: "Bajo",
        estado: "Abierto",
        asignadoA: null,
        fechaCreacion: null,
        fechaResolucion: null,
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el defecto",
        life: 3000,
      });
    }
  };

  // Handle defect deletion
  const handleDeleteDefect = async (defectId) => {
    try {
      await deleteDefect(defectId);
      setDefects(defects.filter((defect) => defect.id !== defectId));
      toast.current.show({
        severity: "success",
        summary: "Defecto eliminado",
        detail: "El defecto se eliminó exitosamente",
        life: 3000,
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el defecto",
        life: 3000,
      });
    }
  };

  // Open dialog for editing a defect
  const editDefect = (defect) => {
    setEditMode(true);
    setSelectedDefect(defect);
    setNewDefect({
      ...defect,
      fechaCreacion: new Date(defect.fechaCreacion),
      fechaResolucion: defect.fechaResolucion
        ? new Date(defect.fechaResolucion)
        : null,
    });
    setShowDialog(true);
  };

  return (
    <div className="p-m-4">
      <Toast ref={toast} />
      {loading ? (
        <p>Cargando detalles del caso de prueba...</p>
      ) : (
        <>
          {testCase && (
            <Card
              title={`Caso de Prueba: ${testCase.nombre}`}
              className="p-mb-4"
            >
              <p>{testCase.descripcion}</p>
              <p>
                <strong>Criterio de Aceptación:</strong>{" "}
                {testCase.criterioAceptacion}
              </p>
              <p>
                <strong>Estado:</strong> {testCase.estado}
              </p>
            </Card>
          )}

          <Card title="Defectos" className="p-mb-4 mt-5">
            <div className="p-d-flex p-jc-between p-ai-center p-mb-2">
              <Button
                label="Crear Defecto"
                className="p-button-success"
                onClick={() => {
                  setEditMode(false);
                  setShowDialog(true);
                }}
              />
            </div>
            <DataTable
              value={defects}
              paginator
              rows={5}
              className="p-datatable-sm"
            >
              <Column
                field="descripcion"
                header="Descripción"
                sortable
              ></Column>
              <Column field="severidad" header="Severidad" sortable></Column>
              <Column field="estado" header="Estado" sortable></Column>
              <Column
                field="fechaCreacion"
                header="Fecha de Creación"
                sortable
              ></Column>
              <Column
                field="fechaResolucion"
                header="Fecha de Resolución"
                sortable
              ></Column>
              <Column
                header="Acciones"
                body={(rowData) => (
                  <div className="p-d-flex p-ai-center">
                    <Button
                      label="Editar"
                      className="p-button-text p-button-warning"
                      onClick={() => editDefect(rowData)}
                    />
                    <Button
                      label="Eliminar"
                      className="p-button-text p-button-danger"
                      onClick={() => handleDeleteDefect(rowData.id)}
                    />
                  </div>
                )}
              ></Column>
            </DataTable>
          </Card>

          <Dialog
            header={editMode ? "Editar Defecto" : "Crear Defecto"}
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
                  onClick={handleSaveDefect}
                />
              </div>
            }
            onHide={() => setShowDialog(false)}
          >
            <div className="p-fluid">
              <div className="p-field">
                <label htmlFor="descripcion">Descripción</label>
                <InputTextarea
                  id="descripcion"
                  value={newDefect.descripcion}
                  onChange={(e) =>
                    setNewDefect({ ...newDefect, descripcion: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="p-field">
                <label htmlFor="severidad">Severidad</label>
                <Dropdown
                  id="severidad"
                  value={newDefect.severidad}
                  options={severidadOptions}
                  onChange={(e) =>
                    setNewDefect({ ...newDefect, severidad: e.value })
                  }
                />
              </div>
              <div className="p-field">
                <label htmlFor="estado">Estado</label>
                <Dropdown
                  id="estado"
                  value={newDefect.estado}
                  options={estadoOptions}
                  onChange={(e) =>
                    setNewDefect({ ...newDefect, estado: e.value })
                  }
                />
              </div>
              <div className="p-field">
                <label htmlFor="asignadoA">Asignado a</label>
                <Dropdown
                  id="asignadoA"
                  value={newDefect.asignadoA}
                  options={users.map((user) => ({
                    label: user.nombre,
                    value: user.id,
                  }))}
                  onChange={(e) =>
                    setNewDefect({ ...newDefect, asignadoA: e.value })
                  }
                />
              </div>
              <div className="p-field">
                <label htmlFor="fechaCreacion">Fecha de Creación</label>
                <Calendar
                  id="fechaCreacion"
                  value={newDefect.fechaCreacion}
                  onChange={(e) =>
                    setNewDefect({ ...newDefect, fechaCreacion: e.value })
                  }
                  dateFormat="yy-mm-dd"
                  showIcon
                />
              </div>
              <div className="p-field">
                <label htmlFor="fechaResolucion">Fecha de Resolución</label>
                <Calendar
                  id="fechaResolucion"
                  value={newDefect.fechaResolucion}
                  onChange={(e) =>
                    setNewDefect({ ...newDefect, fechaResolucion: e.value })
                  }
                  dateFormat="yy-mm-dd"
                  showIcon
                />
              </div>
            </div>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default DefectsPage;
