import { useState, useEffect } from "react"; // <-- AÑADIR useState y useEffect
import { useNavigate, useParams } from "react-router"; // Corregir import si usas react-router

import { EmployeeForm } from "../components";
import { useEmployeesStore } from "../states/employeesStore";
import { useCentroCostos } from "../../centros-costo/hooks/useCentroCostos";
import { updateEmployeeByRut } from "../services/updateEmployeeByRut";
import { getEmployeeByRut } from "../services/getEmployeeByRut"; // <-- NECESITAS ESTE SERVICIO

const EditEmployeePage = () => {
  const navigate = useNavigate();
  const { rut } = useParams();

  // --- Estados locales para manejar la carga del empleado ---
  const [employeeToEdit, setEmployeeToEdit] = useState(null); // <-- NUEVO: Estado para el empleado
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(true); // <-- NUEVO: Estado de carga

  // --- Hooks para los datos ---
  // El nombre de la variable de centroCostosLookup no era el correcto
  const { centroCostosLookup, loading: loadingLookups } = useCentroCostos();
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
        // Opcional: Redirigir si el empleado no se encuentra
        // navigate("/employees");
      } finally {
        setIsLoadingEmployee(false);
      }
    };

    fetchEmployee();
  }, [rut]); // Se ejecuta cada vez que el RUT de la URL cambie

  console.log("Empleado: ", employeeToEdit);

  // --- CORREGIDO: handleSubmit con el payload correcto para empleados ---
  const handleSubmit = async (formValues) => {
    // El payload debe coincidir con el "Request body" de tu API
    const payload = {
      rut: formValues.rut.trim(),
      email: formValues.email.trim(),
      nombre: formValues.nombre.trim(),
      apellido_paterno: formValues.apellido_paterno.trim(),
      apellido_materno: formValues.apellido_materno?.trim() || "",
      nombre_completo: formValues.nombre_completo.trim(),
      centrocosto: formValues.centrocosto ? formValues.centrocosto : null,
      esta_activo: !!formValues.esta_activo,
    };

    try {
      const updatedEmployee = await updateEmployeeByRut(rut, payload);
      updateEmployeeInStore(rut, updatedEmployee);

      navigate("/catalogos/empleados"); // <-- CORREGIDO: Redirigir a la lista de empleados
    } catch (e) {
      console.error("Error actualizando el empleado:", e);
      // Aquí podrías mostrar una notificación de error al usuario
    }
  };

  // --- Manejo de estados de carga ---
  if (isLoadingEmployee) {
    return <div>Cargando datos del empleado...</div>; // O un spinner
  }

  if (!employeeToEdit) {
    return <div>Empleado no encontrado.</div>;
  }

  // --- Renderizado del formulario ---
  return (
    <EmployeeForm
      initialEmpleado={employeeToEdit} // <-- CORREGIDO: Pasar el empleado cargado
      centrosCosto={centroCostosLookup || []}
      loadingLookups={loadingLookups}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)} // Esto está bien para "volver atrás"
    />
  );
};

export default EditEmployeePage;
