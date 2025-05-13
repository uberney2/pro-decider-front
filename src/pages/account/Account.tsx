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
import { v4 as uuidv4 } from "uuid";

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchBuOwner, setSearchBuOwner] = useState("");
  const [searchKeyPeople, setSearchKeyPeople] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // --- Estado y funciones para el modal de Portfolio ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState("");

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewPortfolioName("");
  };

  const handleSavePortfolio = async () => {
    if (!newPortfolioName.trim()) return;
    const payload = {
      id: uuidv4(),
      name: newPortfolioName.trim(),
    };
    try {
      const res = await fetch("http://localhost:8080/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      closeCreateModal();
      window.location.reload();
    } catch (err) {
      console.error("Error creating portfolio:", err);
    }
  };

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

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesName = acc.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesBuOwner = acc.buOwner.name.toLowerCase().includes(searchBuOwner.toLowerCase());
      const matchesKey =
        searchKeyPeople === "" ||
        (acc.keyPeople &&
          acc.keyPeople.some((kp: any) =>
            String(kp.name).toLowerCase().includes(searchKeyPeople.toLowerCase())
          ));
      return matchesName && matchesBuOwner && matchesKey;
    });
  }, [accounts, searchName, searchBuOwner, searchKeyPeople]);

  const handleViewAccount = (account: Account) => {
    navigate(`/accounts/${account.id}`, { state: { account } });
  };

  const handleNewAccount = () => {
    navigate("/accounts/new");
  };

  const columns = useMemo<ColumnDef<Account, any>[]>(() => [
    { accessorKey: "name", header: "Accounts Name" },
    {
      accessorFn: (row) => row.buOwner.name,
      id: "buOwner",
      header: "BU Owner",
    },
    {
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

  const portfolioName = portfolio ? portfolio.name : "No Portfolio";

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.portfolioTitle}>{portfolioName}</h1>
          <div className={styles.headerButtons}>
            <button
              className={styles.createPortfolioButton}
              onClick={openCreateModal}
            >
              Create Portfolio
            </button>
            <button
              className={styles.newAccountButton}
              onClick={handleNewAccount}
            >
              New Account
            </button>
          </div>
        </header>

        {showCreateModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>Create Portfolio</h2>
              <input
                type="text"
                placeholder="Portfolio name"
                value={newPortfolioName}
                onChange={(e) => setNewPortfolioName(e.target.value)}
              />
              <div className={styles.modalActions}>
                <button onClick={handleSavePortfolio}>Save</button>
                <button onClick={closeCreateModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}

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
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
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
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
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
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
