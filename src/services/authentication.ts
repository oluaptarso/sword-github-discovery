import type { ICreateUserInput, ICreateUserOutput, ILoginInput, ILoginUserOutput } from "@/interfaces/authentication.service";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import FirebaseService from "./firebase";

const AuthenticationService = {
  createUser: async ({ name, email, password }: ICreateUserInput): Promise<ICreateUserOutput> => {
    const response: ICreateUserOutput = {
      success: true,
    };

    try {
      const res = await createUserWithEmailAndPassword(FirebaseService.getAuthService(), email, password);
      const user = res.user;

      await sendEmailVerification(user);
      await FirebaseService.getAuthService().updateCurrentUser({ ...user, displayName: name });

      response.user = {
        displayName: name,
        email: user.email || "",
        id: user.uid,
        token: await user.getIdToken(),
        emailVerified: user.emailVerified,
      };
    } catch (error) {
      console.error(error);
      response.success = false;
      response.error = error;
    }

    return response;
  },
  authenticate: async ({ email, password }: ILoginInput): Promise<ILoginUserOutput> => {
    const response: ILoginUserOutput = {
      success: true,
    };

    try {
      const userCredentials = await signInWithEmailAndPassword(FirebaseService.getAuthService(), email, password);

      response.user = {
        displayName: userCredentials.user.email || "",
        email: userCredentials.user.email || "",
        id: userCredentials.user.uid,
        token: await userCredentials.user.getIdToken(),
        emailVerified: userCredentials.user.emailVerified,
      };
    } catch (error) {
      console.error(error);
      response.success = false;
      response.error = error;
    }

    return response;
  },
  logout: () => {
    signOut(FirebaseService.getAuthService());
  },
};

export default AuthenticationService;
