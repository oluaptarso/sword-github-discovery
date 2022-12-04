export interface IAuthenticatedUser {
  id?: string;
  displayName: string;
  email: string;
  token: string;
  emailVerified: boolean;
}
