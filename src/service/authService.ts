import axios from "axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

const API_URL = "http://localhost:8080"; // Cambia la URL según tu backend

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/api/auth/login`,
    credentials
  );
  return response.data;
}