import React, { useEffect, useState } from "react";
import {
  getProjects,
  getDefects,
  getTestPlans,
  getTestExecutions,
} from "../api";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";

const ReportPage = () => {
  const [projects, setProjects] = useState([]);
  const [defects, setDefects] = useState([]);
  const [testPlans, setTestPlans] = useState([]);
  const [testExecutions, setTestExecutions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await getProjects();
        setProjects(projectsResponse.data);

        const defectsResponse = await getDefects();
        setDefects(defectsResponse.data);

        const testPlansResponse = await getTestPlans();
        setTestPlans(testPlansResponse.data);

        const testExecutionsResponse = await getTestExecutions();
        setTestExecutions(testExecutionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Preparing data for charts
  const projectStatusData = {
    labels: projects.map((p) => p.nombre),
    datasets: [
      {
        label: "Proyectos",
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#FF6384"],
        data: projects.map((p) => (p.estado === "Completado" ? 1 : 0)),
      },
    ],
  };

  const defectsBySeverityData = {
    labels: ["Bajo", "Medio", "Alto", "Crítico"],
    datasets: [
      {
        label: "Defectos por Severidad",
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#FF6384"],
        data: [
          defects.filter((d) => d.severidad === "Bajo").length,
          defects.filter((d) => d.severidad === "Medio").length,
          defects.filter((d) => d.severidad === "Alto").length,
          defects.filter((d) => d.severidad === "Crítico").length,
        ],
      },
    ],
  };

  const testExecutionsResultsData = {
    labels: ["Exitoso", "Fallido"],
    datasets: [
      {
        label: "Resultados de Ejecuciones de Prueba",
        backgroundColor: ["#66BB6A", "#FF6384"],
        data: [
          testExecutions.filter((e) => e.resultado === "Exitoso").length,
          testExecutions.filter((e) => e.resultado === "Fallido").length,
        ],
      },
    ],
  };

  const defectsByProjectData = {
    labels: projects.map((p) => p.nombre),
    datasets: [
      {
        label: "Defectos por Proyecto",
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#FF6384"],
        data: projects.map(
          (p) => defects.filter((d) => d.proyectoId === p.id).length
        ),
      },
    ],
  };

  const testPlansByProjectData = {
    labels: projects.map((p) => p.nombre),
    datasets: [
      {
        label: "Planes de Prueba por Proyecto",
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#FF6384"],
        data: projects.map(
          (p) => testPlans.filter((tp) => tp.proyectoId === p.id).length
        ),
      },
    ],
  };

  const testCasesCompletionData = {
    labels: ["Pendiente", "En Progreso", "Completado"],
    datasets: [
      {
        label: "Estado de Casos de Prueba",
        backgroundColor: ["#FFA726", "#42A5F5", "#66BB6A"],
        data: [
          testExecutions.filter((e) => e.estado === "Pendiente").length,
          testExecutions.filter((e) => e.estado === "En Progreso").length,
          testExecutions.filter((e) => e.estado === "Completado").length,
        ],
      },
    ],
  };

  return (
    <div className="p-m-4">
      <Card title="Reportes del Sistema" className="p-mb-4">
        <div className="p-grid gap-6">
          <div className="p-col-12 p-md-6">
            <Card title="Estado de Proyectos">
              <Chart
                type="bar"
                data={projectStatusData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </Card>
          </div>
          <div className="p-col-12 p-md-6">
            <Card title="Defectos por Severidad">
              <Chart
                type="pie"
                data={defectsBySeverityData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </Card>
          </div>
          <div className="p-col-12 p-md-6">
            <Card title="Resultados de Ejecuciones de Prueba">
              <Chart
                type="doughnut"
                data={testExecutionsResultsData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </Card>
          </div>
          {/* <div className="p-col-12 p-md-6">
            <Card title="Defectos por Proyecto">
              <Chart
                type="horizontalBar"
                data={defectsByProjectData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </Card>
          </div> */}
          <div className="p-col-12 p-md-6">
            <Card title="Planes de Prueba por Proyecto">
              <Chart
                type="line"
                data={testPlansByProjectData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </Card>
          </div>
          {/* <div className="p-col-12 p-md-6">
            <Card title="Estado de Casos de Prueba">
              <Chart
                type="polarArea"
                data={testCasesCompletionData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </Card>
          </div> */}
        </div>
      </Card>
    </div>
  );
};

export default ReportPage;
