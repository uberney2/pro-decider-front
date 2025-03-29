import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import styles from "./AccountsPage.module.css";
import { Account } from "../../types/Account";
import { getAccounts } from "../../service/accountService";

const AccountsPage: React.FC = () => {
  // Estado para almacenar las cuentas y los filtros
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchBuOwner, setSearchBuOwner] = useState("");
  const [searchKeyPeople, setSearchKeyPeople] = useState("");

  // Llamada al servicio para traer las cuentas al montar el componente
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

  // Filtrado local de cuentas según los inputs
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesName = acc.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesBuOwner = acc.buOwner.name
        .toLowerCase()
        .includes(searchBuOwner.toLowerCase());
      const matchesKey =
        searchKeyPeople === "" ||
        (acc.keyPeople &&
          acc.keyPeople.some((kp: string) =>
            kp.toLowerCase().includes(searchKeyPeople.toLowerCase())
          ));
      return matchesName && matchesBuOwner && matchesKey;
    });
  }, [accounts, searchName, searchBuOwner, searchKeyPeople]);

  // Definir las columnas de la tabla
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
        row.keyPeople && row.keyPeople.length > 0
          ? row.keyPeople.join(", ")
          : "—",
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

  // Crear la instancia de react-table
  const table = useReactTable({
    data: filteredAccounts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Funciones de acción
  const handleViewAccount = (accountId: string) => {
    // Aquí rediriges o abres un modal con el detalle de la cuenta
    console.log("Ver detalles de la cuenta:", accountId);
  };

  const handleNewAccount = () => {
    // Aquí rediriges o abres el formulario para crear una nueva cuenta
    console.log("Crear nueva cuenta");
  };

  // Se asume que todas las cuentas pertenecen a un mismo portfolio; si hay varios, se debe ajustar.
  const portfolioName =
    accounts.length > 0 ? accounts[0].portfolio.name : "No Portfolio";

  return (
    <div className={styles.container}>
      {/* Encabezado: Portfolio y botón para crear nueva cuenta */}
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

      {/* Tabla usando @tanstack/react-table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación (placeholder) */}
      <div className={styles.pagination}>
        <span>1 2 3 ...</span>
      </div>
    </div>
  );
};

export default AccountsPage;
