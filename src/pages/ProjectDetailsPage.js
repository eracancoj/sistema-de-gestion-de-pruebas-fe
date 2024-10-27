import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, getTestPlans, getDefects, getUsers, createTestPlan, updateTestPlan, deleteTestPlan } from '../api';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [testPlans, setTestPlans] = useState([]);
  const [defects, setDefects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTestPlan, setSelectedTestPlan] = useState(null);
  const [newTestPlan, setNewTestPlan] = useState({ nombre: '', descripcion: '', fechaCreacion: null });
  const toast = React.useRef(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectResponse = await getProjectById(projectId);
        const usersResponse = await getUsers();
        setUsers(usersResponse.data);

        const lider = usersResponse.data.find(user => user.id === projectResponse.data.liderId);
        setProject({ ...projectResponse.data, liderNombre: lider ? lider.nombre : 'No asignado' });

        const testPlansResponse = await getTestPlans();
        const projectTestPlans = testPlansResponse.data.filter(plan => plan.proyectoId === parseInt(projectId));
        setTestPlans(projectTestPlans);

        const defectsResponse = await getDefects();
        const projectDefects = defectsResponse.data.filter(defect => defect.proyectoId === parseInt(projectId));
        setDefects(projectDefects);
      } catch (err) {
        console.error('Error fetching project details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  // Handle test plan creation or update
  const handleSaveTestPlan = async () => {
    const formattedTestPlan = {
      ...newTestPlan,
      fechaCreacion: newTestPlan.fechaCreacion ? newTestPlan.fechaCreacion.toISOString().split('T')[0] : null,
      proyectoId: parseInt(projectId),
    };

    try {
      if (editMode) {
        await updateTestPlan(selectedTestPlan.id, formattedTestPlan);
        setTestPlans(testPlans.map((plan) => (plan.id === selectedTestPlan.id ? formattedTestPlan : plan)));
        toast.current.show({ severity: 'success', summary: 'Plan de Prueba actualizado', detail: 'El plan de prueba se actualizó exitosamente', life: 3000 });
      } else {
        await createTestPlan(formattedTestPlan);
        setTestPlans([...testPlans, formattedTestPlan]);
        toast.current.show({ severity: 'success', summary: 'Plan de Prueba creado', detail: 'El plan de prueba se creó exitosamente', life: 3000 });
      }
      setShowDialog(false);
      setNewTestPlan({ nombre: '', descripcion: '', fechaCreacion: null });
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el plan de prueba', life: 3000 });
    }
  };

  // Handle test plan deletion
  const handleDeleteTestPlan = async (testPlanId) => {
    try {
      await deleteTestPlan(testPlanId);
      setTestPlans(testPlans.filter((plan) => plan.id !== testPlanId));
      toast.current.show({ severity: 'success', summary: 'Plan de Prueba eliminado', detail: 'El plan de prueba se eliminó exitosamente', life: 3000 });
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el plan de prueba', life: 3000 });
    }
  };

  // Open dialog for editing a test plan
  const editTestPlan = (testPlan) => {
    setEditMode(true);
    setSelectedTestPlan(testPlan);
    setNewTestPlan({ ...testPlan, fechaCreacion: new Date(testPlan.fechaCreacion) });
    setShowDialog(true);
  };

  // Navigate to Test Cases Page
  const viewTestCases = (testPlanId) => {
    navigate(`/test-plans/${testPlanId}/test-cases`);
  };

  return (
    <div className="p-m-4">
      <Toast ref={toast} />
      {loading ? (
        <p>Cargando detalles del proyecto...</p>
      ) : (
        <>
          {project && (
            <Card title={project.nombre} className="p-mb-4">
              <p>{project.descripcion}</p>
              <p><strong>Fecha de Inicio:</strong> {project.fechaInicio}</p>
              <p><strong>Fecha de Fin:</strong> {project.fechaFin}</p>
              <p><strong>Líder del Proyecto:</strong> {project.liderNombre}</p>
            </Card>
          )}

          <Card title="Planes de Prueba" className="p-mb-4 mt-5">
            <div className="p-d-flex p-jc-between p-ai-center p-mb-2">
              <Button label="Crear Plan de Prueba" className="p-button-success" onClick={() => { setEditMode(false); setShowDialog(true); }} />
            </div>
            <DataTable value={testPlans} paginator rows={5} className="p-datatable-sm">
              <Column field="nombre" header="Nombre del Plan de Prueba" sortable></Column>
              <Column field="descripcion" header="Descripción" sortable></Column>
              <Column field="fechaCreacion" header="Fecha de Creación" sortable></Column>
              <Column
                header="Acciones"
                body={(rowData) => (
                  <div className="p-d-flex p-ai-center">
                    <Button label="Ver" className="p-button-text p-button-info" onClick={() => viewTestCases(rowData.id)} />
                    <Button label="Editar" className="p-button-text p-button-warning" onClick={() => editTestPlan(rowData)} />
                    <Button label="Eliminar" className="p-button-text p-button-danger" onClick={() => handleDeleteTestPlan(rowData.id)} />
                  </div>
                )}
              ></Column>
            </DataTable>
          </Card>

          <Dialog header={editMode ? "Editar Plan de Prueba" : "Crear Plan de Prueba"} visible={showDialog} style={{ width: '50vw' }} footer={
            <div>
              <Button label="Cancelar" className="p-button-text" onClick={() => setShowDialog(false)} />
              <Button label={editMode ? "Actualizar" : "Crear"} className="p-button-primary" onClick={handleSaveTestPlan} />
            </div>
          } onHide={() => setShowDialog(false)}>
            <div className="p-fluid">
              <div className="p-field">
                <label htmlFor="nombre">Nombre del Plan de Prueba</label>
                <InputText id="nombre" value={newTestPlan.nombre} onChange={(e) => setNewTestPlan({ ...newTestPlan, nombre: e.target.value })} />
              </div>
              <div className="p-field">
                <label htmlFor="descripcion">Descripción</label>
                <InputTextarea id="descripcion" value={newTestPlan.descripcion} onChange={(e) => setNewTestPlan({ ...newTestPlan, descripcion: e.target.value })} rows={3} />
              </div>
              <div className="p-field">
                <label htmlFor="fechaCreacion">Fecha de Creación</label>
                <Calendar id="fechaCreacion" value={newTestPlan.fechaCreacion} onChange={(e) => setNewTestPlan({ ...newTestPlan, fechaCreacion: e.value })} dateFormat="yy-mm-dd" showIcon />
              </div>
            </div>
          </Dialog>

          <Card title="Defectos" className="p-mb-4 mt-5">
            <DataTable value={defects} paginator rows={5} className="p-datatable-sm">
              <Column field="descripcion" header="Descripción" sortable></Column>
              <Column field="severidad" header="Severidad" sortable></Column>
              <Column field="estado" header="Estado" sortable></Column>
              <Column field="fechaCreacion" header="Fecha de Creación" sortable></Column>
              <Column field="fechaResolucion" header="Fecha de Resolución" sortable></Column>
            </DataTable>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProjectDetailsPage;