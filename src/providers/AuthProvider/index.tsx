import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useSessionStorage } from "react-use";

type TAuthContextValueWithoutAction = {
  isLogined: boolean;
  user: null | {
    email: string;
  };
};

type TAuthContextValue = TAuthContextValueWithoutAction & {
  action: {
    login: (args: { provider: string; email: string }) => Promise<boolean>;
    logout: () => Promise<boolean>;
  };
};

const authContextDefaultValueWithoutAction: TAuthContextValueWithoutAction = {
  isLogined: false,
  user: null,
};

const authContextDefaultValue: TAuthContextValue = {
  ...authContextDefaultValueWithoutAction,
  action: {
    login: async () => {
      return true;
    },
    logout: async () => {
      return true;
    },
  },
};

const AuthContext = createContext<TAuthContextValue>(authContextDefaultValue);

export function AuthProvider({ children }: PropsWithChildren): ReactNode {
  const [valueWithoutAction, setValueWithoutAction] = useSessionStorage<
    Omit<TAuthContextValue, "action">
  >("auth-session", authContextDefaultValue);

  const login = useCallback(
    async (args: { provider: string; email: string }) => {
      setValueWithoutAction({
        isLogined: true as const,
        user: {
          email: args.email,
        },
      });

      console.log(args);

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
      action: { login, logout },
    }),
    [login, logout, valueWithoutAction]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
