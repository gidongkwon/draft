import { createContext, useContext, type ParentProps } from "solid-js";

const noop = () => {};

const AuthTriggerContext = createContext<() => void>(noop);

type AuthTriggerProviderProps = ParentProps<{
  onSignInClick: () => void;
}>;

export function AuthTriggerProvider(props: AuthTriggerProviderProps) {
  return (
    <AuthTriggerContext.Provider value={props.onSignInClick}>
      {props.children}
    </AuthTriggerContext.Provider>
  );
}

export function useAuthTrigger() {
  return useContext(AuthTriggerContext);
}
