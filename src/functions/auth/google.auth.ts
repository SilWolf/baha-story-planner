import { bAuthSignIn } from "../firebase.functions";
import { AuthProviderType, hashIdentification } from "./auth";

const googleAuthProvider: AuthProviderType = {
  login: async () =>
    bAuthSignIn().then(async (user) => ({
      identification: await hashIdentification(user.email),
      user: {
        profile: {
          email: user.email,
        },
      },
    })),
  logout: async () => {
    return true;
  },
};

export default googleAuthProvider;
