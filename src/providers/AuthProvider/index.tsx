import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type TAuthContextValueWithoutAction = {
  isLogined: boolean;
  user: null | {
    email: string;
  };
};

type TAuthContextValue = TAuthContextValueWithoutAction & {
  action: {
    login: () => Promise<boolean>;
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
  const [valueWithoutAction, setValueWithoutAction] = useState<
    Omit<TAuthContextValue, "action">
  >(authContextDefaultValue);

  const login = useCallback(async () => {
    setValueWithoutAction({
      isLogined: true as const,
      user: {
        email: "dummyemail@gmail.com",
      },
    });

    return true;
  }, []);

  const logout = useCallback(async () => {
    setValueWithoutAction({
      isLogined: false as const,
      user: null,
    });

    return true;
  }, []);

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
