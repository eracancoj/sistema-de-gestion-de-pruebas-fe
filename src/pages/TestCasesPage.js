import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestPlanById, getProjectById, getTestCases, createTestCase, updateTestCase, deleteTestCase } from '../api';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

const TestCasesPage = () => {
  const { testPlanId } = useParams();
  const navigate = useNavigate();
  const [testPlan, setTestPlan] = useState(null);
  const [project, setProject] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [newTestCase, setNewTestCase] = useState({ nombre: '', descripcion: '', criterioAceptacion: '', estado: 'Pendiente' });
  const toast = React.useRef(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const testPlanResponse = await getTestPlanById(testPlanId);
        setTestPlan(testPlanResponse.data);

        const projectResponse = await getProjectById(testPlanResponse.data.proyectoId);
        setProject(projectResponse.data);

        const testCasesResponse = await getTestCases();
        const associatedTestCases = testCasesResponse.data.filter(testCase => testCase.planPruebaId === parseInt(testPlanId));
        setTestCases(associatedTestCases);
      } catch (err) {
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [testPlanId]);

  // Handle test case creation or update
  const handleSaveTestCase = async () => {
    const formattedTestCase = {
      ...newTestCase,
      planPruebaId: parseInt(testPlanId),
    };

    try {
      if (editMode) {
        await updateTestCase(selectedTestCase.id, formattedTestCase);
        setTestCases(testCases.map((testCase) => (testCase.id === selectedTestCase.id ? formattedTestCase : testCase)));
        toast.current.show({ severity: 'success', summary: 'Caso de Prueba actualizado', detail: 'El caso de prueba se actualizó exitosamente', life: 3000 });
      } else {
        await createTestCase(formattedTestCase);
        setTestCases([...testCases, formattedTestCase]);
        toast.current.show({ severity: 'success', summary: 'Caso de Prueba creado', detail: 'El caso de prueba se creó exitosamente', life: 3000 });
      }
      setShowDialog(false);
      setNewTestCase({ nombre: '', descripcion: '', criterioAceptacion: '', estado: 'Pendiente' });
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el caso de prueba', life: 3000 });
    }
  };

  // Handle test case deletion
  const handleDeleteTestCase = async (testCaseId) => {
    try {
      await deleteTestCase(testCaseId);
      setTestCases(testCases.filter((testCase) => testCase.id !== testCaseId));
      toast.current.show({ severity: 'success', summary: 'Caso de Prueba eliminado', detail: 'El caso de prueba se eliminó exitosamente', life: 3000 });
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el caso de prueba', life: 3000 });
    }
  };

  // Open dialog for editing a test case
  const editTestCase = (testCase) => {
    setEditMode(true);
    setSelectedTestCase(testCase);
    setNewTestCase({ ...testCase });
    setShowDialog(true);
  };

  // Navigate to Defects Page
  const viewDefects = (testCaseId) => {
    navigate(`/test-cases/${testCaseId}/defects`);
  };

  return (
    <div className="p-m-4">
      <Toast ref={toast} />
      {loading ? (
        <p>Cargando detalles del plan de prueba...</p>
      ) : (
        <>
          {testPlan && project && (
            <Card title={`Plan de Prueba: ${testPlan.nombre}`} className="p-mb-4">
              <p><strong>Proyecto:</strong> {project.nombre}</p>
              <p>{testPlan.descripcion}</p>
              <p><strong>Fecha de Creación:</strong> {testPlan.fechaCreacion}</p>
            </Card>
          )}

          <Card title="Casos de Prueba" className="p-mb-4 mt-5">
            <div className="p-d-flex p-jc-between p-ai-center p-mb-2">
              <Button label="Crear Caso de Prueba" className="p-button-success" onClick={() => { setEditMode(false); setShowDialog(true); }} />
            </div>
            <DataTable value={testCases} paginator rows={5} className="p-datatable-sm">
              <Column field="nombre" header="Nombre del Caso de Prueba" sortable></Column>
              <Column field="descripcion" header="Descripción" sortable></Column>
              <Column field="criterioAceptacion" header="Criterio de Aceptación" sortable></Column>
              <Column field="estado" header="Estado" sortable></Column>
              <Column
                header="Acciones"
                body={(rowData) => (
                  <div className="p-d-flex p-ai-center">
                    <Button label="Ejecutar" className="p-button-text p-button-info" onClick={() => viewDefects(rowData.id)} />
                    <Button label="Editar" className="p-button-text p-button-warning" onClick={() => editTestCase(rowData)} />
                    <Button label="Eliminar" className="p-button-text p-button-danger" onClick={() => handleDeleteTestCase(rowData.id)} />
                  </div>
                )}
              ></Column>
            </DataTable>
          </Card>

          <Dialog header={editMode ? "Editar Caso de Prueba" : "Crear Caso de Prueba"} visible={showDialog} style={{ width: '50vw' }} footer={
            <div>
              <Button label="Cancelar" className="p-button-text" onClick={() => setShowDialog(false)} />
              <Button label={editMode ? "Actualizar" : "Crear"} className="p-button-primary" onClick={handleSaveTestCase} />
            </div>
          } onHide={() => setShowDialog(false)}>
            <div className="p-fluid">
              <div className="p-field">
                <label htmlFor="nombre">Nombre del Caso de Prueba</label>
                <InputText id="nombre" value={newTestCase.nombre} onChange={(e) => setNewTestCase({ ...newTestCase, nombre: e.target.value })} />
              </div>
              <div className="p-field">
                <label htmlFor="descripcion">Descripción</label>
                <InputTextarea id="descripcion" value={newTestCase.descripcion} onChange={(e) => setNewTestCase({ ...newTestCase, descripcion: e.target.value })} rows={3} />
              </div>
              <div className="p-field">
                <label htmlFor="criterioAceptacion">Criterio de Aceptación</label>
                <InputTextarea id="criterioAceptacion" value={newTestCase.criterioAceptacion} onChange={(e) => setNewTestCase({ ...newTestCase, criterioAceptacion: e.target.value })} rows={3} />
              </div>
              <div className="p-field">
                <label htmlFor="estado">Estado</label>
                <InputText id="estado" value={newTestCase.estado} onChange={(e) => setNewTestCase({ ...newTestCase, estado: e.target.value })} />
              </div>
            </div>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default TestCasesPage;