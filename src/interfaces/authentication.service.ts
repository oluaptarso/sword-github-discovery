import type { IAuthenticatedUser } from "./user";

export interface ICreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface ICreateUserOutput {
  success: boolean;
  user?: IAuthenticatedUser;
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
  login: ({ email, password }: ILoginInput) => Promise<ILoginUserOutput>;
  logout: () => void;
}
