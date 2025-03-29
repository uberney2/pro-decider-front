// src/pages/AccountsPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
} from "@tanstack/react-table";
import styles from "./AccountsPage.module.css";
import { Account } from "../../types/Account";
import { getAccounts } from "../../service/accountService";

const AccountsPage: React.FC = () => {
  // Estado para almacenar todas las cuentas y filtros
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchBuOwner, setSearchBuOwner] = useState("");
  const [searchKeyPeople, setSearchKeyPeople] = useState("");

  // Estado para paginación: pageIndex y pageSize
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Cargar las cuentas desde el servicio al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAccounts();
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    fetchData();
  }, []);

  // Filtrar localmente las cuentas según los filtros ingresados
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesName = acc.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesBuOwner = acc.buOwner.name.toLowerCase().includes(searchBuOwner.toLowerCase());
      const matchesKey =
        searchKeyPeople === "" ||
        (acc.keyPeople &&
          acc.keyPeople.some((kp: string) =>
            kp.toLowerCase().includes(searchKeyPeople.toLowerCase())
          ));
      return matchesName && matchesBuOwner && matchesKey;
    });
  }, [accounts, searchName, searchBuOwner, searchKeyPeople]);

  // Definir las columnas para la tabla
  const columns = useMemo<ColumnDef<Account, any>[]>(() => [
    {
      accessorKey: "name",
      header: "Accounts Name",
    },
    {
      accessorFn: (row) => row.buOwner.name,
      id: "buOwner",
      header: "BU Owner",
    },
    {
      accessorFn: (row) =>
        row.keyPeople && row.keyPeople.length > 0 ? row.keyPeople.join(", ") : "—",
      id: "keyPeople",
      header: "Key People",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          className={styles.arrowButton}
          onClick={() => handleViewAccount(row.original.id)}
        >
          &gt;
        </button>
      ),
    },
  ], []);

  // Configuración de la tabla, integrando el estado de paginación y el modelo de paginación
  const table = useReactTable({
    data: filteredAccounts,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Función para ver detalles de la cuenta (puedes redirigir o abrir un modal)
  const handleViewAccount = (accountId: string) => {
    console.log("Ver detalles de la cuenta:", accountId);
  };

  // Función para crear una nueva cuenta
  const handleNewAccount = () => {
    console.log("Crear nueva cuenta");
  };

  // Para mostrar el nombre del portfolio, se asume que todas las cuentas pertenecen al mismo (ajusta si es necesario)
  const portfolioName = accounts.length > 0 ? accounts[0].portfolio.name : "No Portfolio";

  return (
    <div className={styles.container}>
      {/* Encabezado: Nombre del portfolio y botón para crear nueva cuenta */}
      <header className={styles.header}>
        <h1 className={styles.portfolioTitle}>{portfolioName}</h1>
        <button className={styles.newAccountButton} onClick={handleNewAccount}>
          New Account
        </button>
      </header>

      {/* Filtros */}
      <div className={styles.filters}>
        <div className={styles.filterItem}>
          <label htmlFor="nameFilter">Filter by name</label>
          <input
            id="nameFilter"
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search by Account Name"
          />
        </div>
        <div className={styles.filterItem}>
          <label htmlFor="buFilter">Filter by BU Owner</label>
          <input
            id="buFilter"
            type="text"
            value={searchBuOwner}
            onChange={(e) => setSearchBuOwner(e.target.value)}
            placeholder="Search by BU Owner"
          />
        </div>
        <div className={styles.filterItem}>
          <label htmlFor="kpFilter">Filter by Key People</label>
          <input
            id="kpFilter"
            type="text"
            value={searchKeyPeople}
            onChange={(e) => setSearchKeyPeople(e.target.value)}
            placeholder="Search by Key People"
          />
        </div>
      </div>

      {/* Tabla renderizada con react-table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className={styles.pagination}>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </button>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AccountsPage;
