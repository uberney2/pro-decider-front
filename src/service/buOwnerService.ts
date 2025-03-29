import { BuOwner } from "../types/Account";

export async function getBuOwners(): Promise<BuOwner[]> {
  const response = await fetch("http://localhost:8080/api/buOwner");
  if (!response.ok) {
    throw new Error("Error fetching BU Owners");
  }
  return response.json();
}
