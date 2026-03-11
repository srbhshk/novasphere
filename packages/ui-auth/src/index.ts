// SPDX-License-Identifier: MIT
// @novasphere/ui-auth — package entry
// Authentication UI: LoginForm, UserMenu, AuthGuard, adapter interface, types, schemas.

export { LoginForm } from "./LoginForm";
export type { LoginFormProps } from "./LoginForm";

export { UserMenu } from "./UserMenu";
export type { UserMenuProps } from "./UserMenu";

export { AuthGuard } from "./AuthGuard";
export type { AuthGuardProps } from "./AuthGuard";

export type {
  AuthAdapter,
  AuthResult,
  AuthSession,
  SignInCredentials,
  SignUpCredentials,
} from "./auth.adapter.interface";

export { loginFormSchema } from "./schemas/login.schema";
export type { LoginFormValues } from "./schemas/login.schema";

export { signupFormSchema } from "./schemas/signup.schema";
export type { SignupFormValues } from "./schemas/signup.schema";
