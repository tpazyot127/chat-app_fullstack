export interface ChatInterface {
  _id: string;
  content: string;
  username : string;
  role : string
}

export interface UserInterface {
  _id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  accessToken: string;
}

export interface UserCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserEditCredentials {
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface recivedMesssages {
  content : string,
  role : string, 
  _id: string
}