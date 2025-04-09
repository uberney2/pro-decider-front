// src/pages/AccountsPage.tsx
import React, { useState, useEffect, useMemo, useContext } from "react";
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
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchBuOwner, setSearchBuOwner] = useState("");
  const [searchKeyPeople, setSearchKeyPeople] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Acceder al portfolio almacenado en AuthContext
  const { portfolio } = useContext(AuthContext);
  const navigate = useNavigate();

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

  // Filtrado de cuentas
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesName = acc.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesBuOwner = acc.buOwner.name.toLowerCase().includes(searchBuOwner.toLowerCase());
      // Para keyPeople, asumimos que el campo es un arreglo de objetos y queremos filtrar por su propiedad "name"
      const matchesKey =
        searchKeyPeople === "" ||
        (acc.keyPeople &&
          acc.keyPeople.some((kp: any) =>
            String(kp.name).toLowerCase().includes(searchKeyPeople.toLowerCase())
          ));
      return matchesName && matchesBuOwner && matchesKey;
    });
  }, [accounts, searchName, searchBuOwner, searchKeyPeople]);

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
      // Modificamos la columna keyPeople para mapear los nombres
      accessorFn: (row) =>
        row.keyPeople && row.keyPeople.length > 0
          ? row.keyPeople.map((kp: any) => kp.name).join(", ")
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
          onClick={() => handleViewAccount(row.original)}
        >
          &gt;
        </button>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filteredAccounts,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleViewAccount = (account: Account) => {
    // Navega a la ruta de edición, pasando la cuenta completa en state
    navigate(`/accounts/${account.id}`, { state: { account } });
  };

  const handleNewAccount = () => {
    navigate("/accounts/new");
  };

  // Usar el nombre del portfolio obtenido del AuthContext
  const portfolioName = portfolio ? portfolio.name : "No Portfolio";

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.portfolioTitle}>{portfolioName}</h1>
        <button className={styles.newAccountButton} onClick={handleNewAccount}>
          New Account
        </button>
      </header>

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
