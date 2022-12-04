import type { IAuthenticatedUser } from "./user";

export interface ICreateUserInput {
  displayName: string;
  email: string;
  password: string;
}

export interface ICreateUserOutput {
  success: boolean;
  user?: IAuthenticatedUser;
  error?: any;
}

export interface IUpdateUserInput {
  displayName: string;
  currentEmail: string;
  newEmail: string;
  password: string;
}

export interface IUpdateUserOutput {
  success: boolean;
  error?: any;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginUserOutput {
  success: boolean;
  user?: IAuthenticatedUser;
  error?: any;
}

export default interface IAuthenticationService {
  createUser: (input: ICreateUserInput) => Promise<ICreateUserOutput>;
  updateUser: (input: IUpdateUserInput) => Promise<IUpdateUserOutput>;
  authenticate: ({ email, password }: ILoginInput) => Promise<ILoginUserOutput>;
  logout: () => void;
}
