import axios from "axios";

const API_URL = "https://sistema-de-gestion-de-pruebas-bo.glitch.me";

// Iniciar sesión
export const login = async (credentials) => {
    return await axios.post(`${API_URL}/login`, credentials);
};

// Obtener todos los Usuarios
export const getUsers = async () => {
  return await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Obtener todos los Proyectos
export const getProjects = async () => {
  return await axios.get(`${API_URL}/projects`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Obtener un Proyecto por ID
export const getProjectById = async (id) => {
  return await axios.get(`${API_URL}/projects/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Crear un Proyecto
export const createProject = async (projectData) => {
  return await axios.post(`${API_URL}/projects`, projectData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Actualizar un Proyecto
export const updateProject = async (id, projectData) => {
  return await axios.put(`${API_URL}/projects/${id}`, projectData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Eliminar un Proyecto
export const deleteProject = async (id) => {
  return await axios.delete(`${API_URL}/projects/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Obtener todos los Recursos
export const getResources = async () => {
  return await axios.get(`${API_URL}/resources`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Obtener todos los Planes de Prueba
export const getTestPlans = async () => {
  return await axios.get(`${API_URL}/test-plans`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Obtener un Plan de Prueba por ID
export const getTestPlanById = async (id) => {
  return await axios.get(`${API_URL}/test-plans/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Crear un Plan de Prueba
export const createTestPlan = async (testPlanData) => {
  return await axios.post(`${API_URL}/test-plans`, testPlanData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Actualizar un Plan de Prueba
export const updateTestPlan = async (id, testPlanData) => {
  return await axios.put(`${API_URL}/test-plans/${id}`, testPlanData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Eliminar un Plan de Prueba
export const deleteTestPlan = async (id) => {
  return await axios.delete(`${API_URL}/test-plans/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Obtener todos los Casos de Prueba
export const getTestCases = async () => {
  return await axios.get(`${API_URL}/test-cases`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Obtener un Caso de Prueba por ID
export const getTestCaseById = async (testCaseId) => {
  return await axios.get(`${API_URL}/test-cases/${testCaseId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Crear un Caso de Prueba
export const createTestCase = async (testCaseData) => {
  return await axios.post(`${API_URL}/test-cases`, testCaseData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Actualizar un Caso de Prueba
export const updateTestCase = async (id, testCaseData) => {
  return await axios.put(`${API_URL}/test-cases/${id}`, testCaseData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Obtener todas las Ejecuciones de Prueba
export const getTestExecutions = async () => {
  return await axios.get(`${API_URL}/test-executions`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Crear una Ejecución de Prueba
export const createTestExecution = async (testExecutionData) => {
  return await axios.post(`${API_URL}/test-executions`, testExecutionData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Obtener todos los Defectos
export const getDefects = async () => {
  return await axios.get(`${API_URL}/defects`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Crear un Defecto
export const createDefect = async (defectData) => {
  return await axios.post(`${API_URL}/defects`, defectData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Actualizar un Defecto
export const updateDefect = async (id, defectData) => {
  return await axios.put(`${API_URL}/defects/${id}`, defectData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

// Eliminar un Defecto
export const deleteDefect = async (id) => {
  return await axios.delete(`${API_URL}/defects/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};
