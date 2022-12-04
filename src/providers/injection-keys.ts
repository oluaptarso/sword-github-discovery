import type IAuthenticationService from "@/interfaces/authentication.service";
import type IFirebaseService from "@/interfaces/firebase-service";
import type { InjectionKey } from "vue";

export const firebaseServiceInjectionKey = Symbol() as InjectionKey<IFirebaseService>;
export const authenticationServiceInjectionKey = Symbol() as InjectionKey<IAuthenticationService>;
