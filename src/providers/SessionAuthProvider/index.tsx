import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useSessionStorage } from "react-use";

import { UserSchemaV1 } from "@/schemas/User";

type TAuthContextValueWithoutAction = {
  isLogined: boolean;
  user: null | UserSchemaV1;
};

type TAuthContextValue = TAuthContextValueWithoutAction & {
  login: (args: { provider: string; user: UserSchemaV1 }) => Promise<boolean>;
  logout: () => Promise<boolean>;
};

const sessionAuthContextDefaultValueWithoutAction: TAuthContextValueWithoutAction =
  {
    isLogined: false,
    user: null,
  };

const sessionAuthContextDefaultValue: TAuthContextValue = {
  ...sessionAuthContextDefaultValueWithoutAction,
  login: async () => {
    return true;
  },
  logout: async () => {
    return true;
  },
};

const SessionAuthContext = createContext<TAuthContextValue>(
  sessionAuthContextDefaultValue
);

export function SessionAuthProvider({
  children,
}: PropsWithChildren): ReactNode {
  const [valueWithoutAction, setValueWithoutAction] =
    useSessionStorage<TAuthContextValueWithoutAction>(
      "session-auth-value",
      sessionAuthContextDefaultValue
    );

  const login = useCallback(
    async (args: { provider: string; user: UserSchemaV1 }) => {
      setValueWithoutAction({
        isLogined: true as const,
        user: args.user,
      });

      return true;
    },
    [setValueWithoutAction]
  );

  const logout = useCallback(async () => {
    setValueWithoutAction({
      isLogined: false as const,
      user: null,
    });

    return true;
  }, [setValueWithoutAction]);

  const value = useMemo(
    () => ({
      ...valueWithoutAction,
      login,
      logout,
    }),
    [login, logout, valueWithoutAction]
  );

  return (
    <SessionAuthContext.Provider value={value}>
      {children}
    </SessionAuthContext.Provider>
  );
}

export const useSessionAuth = () => useContext(SessionAuthContext);
