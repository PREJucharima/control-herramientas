import { useState, useEffect } from "react"; // <-- AÑADIR useState y useEffect
import { useNavigate, useParams } from "react-router"; // Corregir import si usas react-router

import { EmployeeForm } from "../components";
import { useEmployeesStore } from "../states/employeesStore";
import { updateEmployeeByRut } from "../services/updateEmployeeByRut";
import { getEmployeeByRut } from "../services/getEmployeeByRut"; // <-- NECESITAS ESTE SERVICIO
import { useCompaniesLookups } from "../../companies/hooks/useCompanies";

const EmployeeEditPage = () => {
  const navigate = useNavigate();
  const { rut } = useParams();

  // --- Estados locales para manejar la carga del empleado ---
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(true);

  // --- Hooks para los datos ---
  const { companies, isLoading } = useCompaniesLookups();
  const updateEmployeeInStore = useEmployeesStore((s) => s.updateEmployee);

  // --- NUEVO: useEffect para buscar el empleado por RUT al cargar la página ---
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setIsLoadingEmployee(true);
        const employeeData = await getEmployeeByRut(rut);
        setEmployeeToEdit(employeeData);
      } catch (e) {
        console.error("Error al obtener el empleado:", e);
      } finally {
        setIsLoadingEmployee(false);
      }
    };

    fetchEmployee();
  }, [rut]);

  console.log("Empleado: ", employeeToEdit);

  const handleSubmit = async (formValues) => {
    const payload = {
      rut: formValues.rut.trim(),
      email: formValues.email.trim(),
      nombre: formValues.nombre.trim(),
      apellido_paterno: formValues.apellido_paterno.trim(),
      apellido_materno: formValues.apellido_materno?.trim() || "",
      nombre_completo: formValues.nombre_completo.trim(),
      empresa: formValues.empresa ? formValues.empresa : null,
      centrocosto: formValues.centrocosto ? formValues.centrocosto : null,
      esta_activo: !!formValues.esta_activo,
    };

    try {
      const updatedEmployee = await updateEmployeeByRut(rut, payload);
      updateEmployeeInStore(rut, updatedEmployee);

      navigate("/maestros/empleados");
    } catch (e) {
      console.error("Error actualizando el empleado:", e);
    }
  };

  if (isLoadingEmployee) {
    return <div>Cargando datos del empleado...</div>;
  }

  if (!employeeToEdit) {
    return <div>Empleado no encontrado.</div>;
  }

  return (
    <EmployeeForm
      initialEmpleado={employeeToEdit}
      companies={companies}
      isLoadingCompanies={isLoading}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    />
  );
};

export default EmployeeEditPage;
