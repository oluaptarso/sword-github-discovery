import MockAuthenticationProvider from "../../src/components/Mock/MockAuthenticationProvider.vue";
import AuthenticationService from "../../src/services/authentication";
import FirebaseService from "../../src/services/firebase";
import type IFirebaseService from "../../src/interfaces/firebase-service";
import type { FirebaseApp } from "firebase/app";
import * as FirebaseMockHelper from "../../src/mocks/firebase-helper";
import { createTestingPinia } from "@pinia/testing";

//#region Prepare Mock Services
const mockFirebaseService: IFirebaseService = {
  getAuthService: FirebaseMockHelper.mockFirebaseApp.getAuthService,
  getAppService: function (): FirebaseApp {
    throw new Error("Function not implemented.");
  },
  getFirebaseErrorTextByKey: function (key: string): string {
    return key;
  },
};

const mockAuthenticationService = new AuthenticationService(
  mockFirebaseService,
  FirebaseMockHelper.mockCreateUserWithEmailAndPassword,
  FirebaseMockHelper.mockSignInWithEmailAndPassword,
  FirebaseMockHelper.mockSignOut,
  FirebaseMockHelper.mockUpdateProfile,
  FirebaseMockHelper.mockUpdateEmail
);
//#endregion Prepare Mock Services

const emailInputFinder = "input[name=email]";
const passwordInputFinder = "input[name=password]";
const confirmPasswordInputFinder = "input[name=confirmPassword]";
const displayNameInputFinder = "input[name=displayName]";
const primaryButtonFinder = "button[primary]";
const linkButtonFinder = "button[link]";
const invalidFeedbackFinder = ".invalid-feedback";

describe("<MockAuthenticationProvider /> Sign In", () => {
  beforeEach(() => {
    cy.mount(MockAuthenticationProvider, {
      props: {
        firebaseService: FirebaseService,
        authenticationService: mockAuthenticationService,
      },
      sync: false,
      global: {
        plugins: [
          createTestingPinia({
            createSpy: cy.spy(),
          }),
        ],
      },
    });
  });

  it("Should trigger email and password validation error", () => {
    cy.get(primaryButtonFinder).click();
    cy.get(invalidFeedbackFinder).should("have.length", 2);
  });

  it("Should trigger email required validation error", () => {
    cy.get(emailInputFinder).trigger("blur");
    cy.get(invalidFeedbackFinder).should("contains.text", "A email address is required");
  });

  it("Should trigger email format validation error", () => {
    cy.get(emailInputFinder).type("asd");
    cy.get(emailInputFinder).trigger("blur");

    cy.get(invalidFeedbackFinder).should("contains.text", "A valid email address is required");
  });

  it("Should trigger password required validation error", () => {
    cy.get(passwordInputFinder).trigger("blur");
    cy.get(invalidFeedbackFinder).should("contains.text", "A password is required");
  });

  it("Should have an incorrect email or password on sign in attempt", () => {
    cy.get(emailInputFinder).type("wrong@email.com");
    cy.get(passwordInputFinder).type("wrongpassword");
    cy.get(primaryButtonFinder).click();

    cy.get("li").should("contains.text", "Incorrect email or password");
  });

  it("Sign in should work", () => {
    cy.get(emailInputFinder).type(FirebaseMockHelper.mockUser.email);
    cy.get(passwordInputFinder).type("123456");
    cy.get(primaryButtonFinder).click();

    cy.get("li").should("have.length", 0);
  });
});

describe("<MockAuthenticationProvider /> Sign Up", () => {
  beforeEach(() => {
    cy.mount(MockAuthenticationProvider, {
      props: {
        firebaseService: FirebaseService,
        authenticationService: mockAuthenticationService,
      },
      sync: false,
    });

    cy.get(linkButtonFinder).click();
  });

  it("Should change to sign up form", () => {
    cy.get(primaryButtonFinder).should("contains.text", "Sign Up");
  });

  it("Should trigger display name, email, and password validation error", () => {
    cy.get(primaryButtonFinder).click();
    cy.get(invalidFeedbackFinder).eq(0).should("have.text", "A display name is required");
    cy.get(invalidFeedbackFinder).eq(1).should("have.text", "A email address is required");
    cy.get(invalidFeedbackFinder).eq(2).should("have.text", "A password is required");
    cy.get(invalidFeedbackFinder).eq(3).should("have.text", "Password confirmation is required");
  });

  it("Should trigger display name required validation error", () => {
    cy.get(displayNameInputFinder).trigger("blur");
    cy.get(invalidFeedbackFinder).should("contains.text", "A display name is required");
  });

  it("Should trigger display name min length validation error", () => {
    cy.get(displayNameInputFinder).type("asd");
    cy.get(displayNameInputFinder).trigger("blur");

    cy.get(invalidFeedbackFinder).should("contains.text", "The display name must be at least 4 characters long");
  });

  it("Should trigger email required validation error", () => {
    cy.get(emailInputFinder).trigger("blur");
    cy.get(invalidFeedbackFinder).should("contains.text", "A email address is required");
  });

  it("Should trigger email format validation error", () => {
    cy.get(emailInputFinder).type("asd");
    cy.get(emailInputFinder).trigger("blur");

    cy.get(invalidFeedbackFinder).should("contains.text", "A valid email address is required");
  });

  it("Should trigger password required validation error", () => {
    cy.get(passwordInputFinder).trigger("blur");
    cy.get(invalidFeedbackFinder).should("contains.text", "A password is required");
  });

  it("Should trigger password min length validation error", () => {
    cy.get(passwordInputFinder).type("12");
    cy.get(passwordInputFinder).blur();
    cy.get(invalidFeedbackFinder).should("contains.text", "The password must be at least 6 characters long");
  });

  it("Should trigger confirm password required validation error", () => {
    cy.get(confirmPasswordInputFinder).trigger("blur");
    cy.get(invalidFeedbackFinder).should("contains.text", "Password confirmation is required");
  });

  it("Should trigger confirm password match validation error", () => {
    cy.get(passwordInputFinder).type("12456");
    cy.get(confirmPasswordInputFinder).type("12");
    cy.get(confirmPasswordInputFinder).blur();
    cy.get(invalidFeedbackFinder).should("contains.text", "The passwords do not match");
  });

  it("Should have an repeated email on sign up attempt", () => {
    cy.get(displayNameInputFinder).type(FirebaseMockHelper.mockUser.displayName);
    cy.get(emailInputFinder).type(FirebaseMockHelper.mockUser.email);
    cy.get(passwordInputFinder).type("123456");
    cy.get(confirmPasswordInputFinder).type("123456");
    cy.get(primaryButtonFinder).click();

    cy.get("li").should("contains.text", "Email already in use");
  });

  it("Sign up should work", () => {
    cy.get(displayNameInputFinder).type(FirebaseMockHelper.mockUser.displayName);
    cy.get(emailInputFinder).type("different@email.com");
    cy.get(passwordInputFinder).type("123456");
    cy.get(confirmPasswordInputFinder).type("123456");
    cy.get(primaryButtonFinder).click();

    cy.get("li").should("have.length", 0);
  });
});
