export interface User {
  id: number;
  email: string;
  name: string;
  lastName?: string; 
  role: string;
  telefono?: string;
  position?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
} 