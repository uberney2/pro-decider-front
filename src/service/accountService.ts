import { Account } from "../types/Account";
import { KeyPerson } from "../types/KeyPerson";

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

// Servicio para crear Key People
export async function createKeyPerson(keyPerson: KeyPerson): Promise<void> {
  const response = await fetch("http://localhost:8080/api/keypeople", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(keyPerson),
  });
  if (!response.ok) {
    throw new Error("Error creating key person");
  }
  return;
}

export async function linkAccountKeyPeople(accountId: string, keyPeopleId: string): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/accounts/${accountId}/keypeople/${keyPeopleId}`, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes: "default note" }),
  });
  if (!response.ok) {
    throw new Error("Error linking key person to account");
  }
  return;
}