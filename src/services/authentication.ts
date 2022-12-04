import type IAuthenticationService from "@/interfaces/authentication.service";
import type { ICreateUserInput, ICreateUserOutput, ILoginInput, ILoginUserOutput, IUpdateUserInput, IUpdateUserOutput } from "@/interfaces/authentication.service";
import type { createUserWithEmailAndPasswordType, signInWithEmailAndPasswordType, signOutType, updateEmailType, updateProfileType } from "@/interfaces/firebase-service";
import type IFirebaseService from "@/interfaces/firebase-service";
import {
  createUserWithEmailAndPassword as CreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as SignInWithEmailAndPassword,
  signOut as SignOut,
  updateProfile as UpdateProfile,
  updateEmail as UpdateEmail,
} from "firebase/auth";
import FirebaseService from "./firebase";

class AuthenticationService implements IAuthenticationService {
  firebaseService: IFirebaseService;
  createUserWithEmailAndPassword: Exclude<createUserWithEmailAndPasswordType, null>;
  signInWithEmailAndPassword: Exclude<signInWithEmailAndPasswordType, null>;
  signOut: Exclude<signOutType, null>;
  updateProfile: Exclude<updateProfileType, null>;
  updateEmail: Exclude<updateEmailType, null>;

  constructor(
    firebaseService: IFirebaseService | null = null,
    createUserWithEmailAndPassword: createUserWithEmailAndPasswordType = null,
    signInWithEmailAndPassword: signInWithEmailAndPasswordType = null,
    signOut: signOutType = null,
    updateProfile: updateProfileType = null,
    updateEmail: updateEmailType = null
  ) {
    if (firebaseService) this.firebaseService = firebaseService;
    else this.firebaseService = FirebaseService;

    if (createUserWithEmailAndPassword) this.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
    else this.createUserWithEmailAndPassword = CreateUserWithEmailAndPassword;

    if (signInWithEmailAndPassword) this.signInWithEmailAndPassword = signInWithEmailAndPassword;
    else this.signInWithEmailAndPassword = SignInWithEmailAndPassword;

    if (signOut) this.signOut = signOut;
    else this.signOut = SignOut;

    if (updateProfile) this.updateProfile = updateProfile;
    else this.updateProfile = UpdateProfile;

    if (updateEmail) this.updateEmail = updateEmail;
    else this.updateEmail = UpdateEmail;
  }

  async createUser({ displayName, email, password }: ICreateUserInput): Promise<ICreateUserOutput> {
    const response: ICreateUserOutput = {
      success: true,
    };

    try {
      const createUserWithEmailAndPasswordResponse = await this.createUserWithEmailAndPassword(FirebaseService.getAuthService(), email, password);
      const user = createUserWithEmailAndPasswordResponse.user;
      await this.updateProfile(user, { displayName });

      response.user = {
        displayName: displayName,
        email: user.email || "",
        id: user.uid,
        token: await user.getIdToken(),
        emailVerified: user.emailVerified,
      };
    } catch (error) {
      response.success = false;
      response.error = error;
    }

    return response;
  }
  async updateUser({ displayName, currentEmail, newEmail, password }: IUpdateUserInput): Promise<IUpdateUserOutput> {
    let response: IUpdateUserOutput | ILoginUserOutput = {
      success: true,
    };

    response = await this.authenticate({ email: currentEmail, password });

    if (!response.success) return response;

    const user = this.firebaseService.getAuthService().currentUser;
    if (!user) {
      response.success = false;
      return response;
    }

    const shouldUpdateEmail = user.email !== newEmail && !!newEmail;
    const shouldUpdateDisplayName = user.displayName !== displayName && !!displayName;

    try {
      if (shouldUpdateEmail) await this.updateEmail(user, newEmail);
      if (shouldUpdateDisplayName) await this.updateProfile(user, { displayName });
    } catch (error) {
      response.success = false;
      response.error = error;
    }

    return response;
  }
  async authenticate({ email, password }: ILoginInput): Promise<ILoginUserOutput> {
    const response: ILoginUserOutput = {
      success: true,
    };

    try {
      const userCredentials = await this.signInWithEmailAndPassword(FirebaseService.getAuthService(), email, password);

      response.user = {
        displayName: userCredentials.user.displayName || "",
        email: userCredentials.user.email || "",
        id: userCredentials.user.uid,
        token: await userCredentials.user.getIdToken(),
        emailVerified: userCredentials.user.emailVerified,
      };
    } catch (error) {
      response.success = false;
      response.error = error;
    }

    return response;
  }
  logout() {
    this.signOut(FirebaseService.getAuthService());
  }
}

export default AuthenticationService;
