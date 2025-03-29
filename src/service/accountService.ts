import { Account } from "../types/Account";

export const getAccounts = async (): Promise<Account[]> => {
  const response = await fetch("http://localhost:8080/api/accounts");
  if (!response.ok) {
    throw new Error("Error fetching accounts");
  }
  const data: Account[] = await response.json();
  return data;
};

export async function createAccount(account: Account): Promise<void> {
    const response = await fetch("http://localhost:8080/api/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    });
  
    if (!response.ok) {
      throw new Error("Error creating account");
    }
  
    return;
  }

  export async function updateAccount(account: Account): Promise<void> {
    const response = await fetch(`http://localhost:8080/api/accounts/${account.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    });
  
    if (!response.ok) {
      throw new Error("Error updating account");
    }
    
    // Si el endpoint no retorna data, simplemente retornamos
    return;
  }