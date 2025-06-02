import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Customers() {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    Nombre: "",
    RFC: "",
    Telefono: "",
    Correo: "",
    Direccion: ""
  });

  const obtenerClientes = () => {
    fetch("http://localhost:3001/api/customers")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch(() => Swal.fire("Error", "No se pudieron cargar los clientes", "error"));
  };


  useEffect(() => {
    obtenerClientes();
  }, []);

  const guardarCliente = async () => {
    if (!nuevoCliente.Nombre) {
      Swal.fire("Campo obligatorio", "El nombre del cliente es requerido.", "warning");
      return;
    }

    const res = await fetch("http://localhost:3001/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoCliente)
    });


    if (res.ok) {
      Swal.fire("Éxito", "Cliente agregado correctamente", "success");
      setNuevoCliente({ Nombre: "", RFC: "", Telefono: "", Correo: "", Direccion: "" });
      obtenerClientes();
    } else {
      Swal.fire("Error", "No se pudo agregar el cliente", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Clientes</h3>

      <div className="card p-3 mb-4">
        <h5>Nuevo Cliente</h5>
        <div className="row">
          {["Nombre", "RFC", "Telefono", "Correo", "Direccion"].map((campo) => (
            <div key={campo} className="col-lg-6 mb-2">
              <label>{campo}</label>
              <input
                type="text"
                className="form-control"
                value={nuevoCliente[campo]}
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, [campo]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
        <button className="btn btn-primary mt-2" onClick={guardarCliente}>
          Guardar Cliente
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="bg-light text-center">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>RFC</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {clientes.map((c) => (
              <tr key={c.ClienteID}>
                <td>{c.ClienteID}</td>
                <td>{c.Nombre}</td>
                <td>{c.RFC}</td>
                <td>{c.Telefono}</td>
                <td>{c.Correo}</td>
                <td>{c.Direccion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
