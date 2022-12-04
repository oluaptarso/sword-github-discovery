/* eslint-disable @typescript-eslint/no-unused-vars */
import { FirebaseError } from "firebase/app";
import type { Auth, User, UserCredential } from "firebase/auth";

export const mockUser = {
  email: "test@mock.com",
  displayName: "Test Mockson",
  uid: "123",
  getIdToken: async (): Promise<string> => "token",
  emailVerified: false,
};

export const mockFirebaseApp: any = {
  getAuthService: () => {
    return {
      currentUser: { ...mockUser },
    };
  },
};

export const mockCreateUserWithEmailAndPassword = async (auth: Auth, email: string, password: string): Promise<UserCredential> => {
  if (email != mockUser.email) {
    const userCredential = {
      user: { ...mockUser },
    };
    return userCredential as UserCredential;
  }

  throw new FirebaseError("auth/email-already-in-use", "auth/email-already-in-use");
};

export const mockSignInWithEmailAndPassword = async (auth: Auth, email: string, password: string): Promise<UserCredential> => {
  if (email == mockUser.email && password == "123456") {
    const userCredential = {
      user: { ...mockUser },
    };
    return userCredential as UserCredential;
  }

  throw new FirebaseError("auth/user-not-found", "auth/user-not-found");
};

export const mockUpdateProfile = async (
  user: User,
  {
    displayName,
    photoURL,
  }: {
    displayName?: string | null;
    photoURL?: string | null;
  }
) => {};

export const mockUpdateEmail = async (user: User, newEmail: string) => {};

export const mockSignOut = async (auth: Auth) => {};
