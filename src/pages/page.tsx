import { useCallback } from "react";
import { Button, Card } from "react-daisyui";

import googleAuthProvider from "@/functions/auth/google.auth";
import { bUpsertUserByIdentification } from "@/functions/firebase.functions";
import { useSessionAuth } from "@/providers/SessionAuthProvider";

export default function RootLandingPage() {
  const { login } = useSessionAuth();

  const handleClickGoogleLogin = useCallback(() => {
    googleAuthProvider.login().then(({ identification, user }) => {
      bUpsertUserByIdentification(identification, user).then((fetchedUser) => {
        login({
          provider: "google",
          user: fetchedUser,
        });
      });
    });
  }, [login]);

  return (
    <div className="container mx-auto text-center flex items-center justify-center h-screen">
      <Card>
        <Card.Body>
          <div className="space-y-2">
            <Button
              fullWidth
              variant="outline"
              onClick={handleClickGoogleLogin}
            >
              以 Google 帳號登入
            </Button>
            <Button fullWidth variant="outline">
              以 Discord 帳號登入
            </Button>
            <Button fullWidth variant="outline">
              以巴哈姆特帳號登入
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
