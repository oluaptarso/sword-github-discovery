import type { FirebaseApp } from "firebase/app";
import type { Auth, User, UserCredential } from "firebase/auth";

export default interface IFirebaseService {
  getAuthService: () => Auth;
  getAppService: () => FirebaseApp;
  getFirebaseErrorTextByKey: (key: string) => string;
}

export type createUserWithEmailAndPasswordType = ((auth: Auth, email: string, password: string) => Promise<UserCredential>) | null;
export type signInWithEmailAndPasswordType = ((auth: Auth, email: string, password: string) => Promise<UserCredential>) | null;
export type signOutType = ((auth: Auth) => Promise<void>) | null;
export type updateProfileType =
  | ((
      user: User,
      {
        displayName,
        photoURL,
      }: {
        displayName?: string | null;
        photoURL?: string | null;
      }
    ) => Promise<void>)
  | null;
export type updateEmailType = ((user: User, newEmail: string) => Promise<void>) | null;
