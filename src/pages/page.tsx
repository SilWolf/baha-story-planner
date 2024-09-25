import { useCallback } from "react";
import { Button, Card } from "react-daisyui";
import { useNavigate } from "react-router-dom";

import googleAuthProvider from "@/functions/auth/google.auth";
import { bDatabaseUpsertUserByIdentification } from "@/functions/firebase.functions";
import { useSessionAuth } from "@/providers/SessionAuthProvider";

export default function RootLandingPage() {
  const navigate = useNavigate();

  const { login } = useSessionAuth();

  const handleClickGoogleLogin = useCallback(async () => {
    const { identification, user } = await googleAuthProvider.login();
    const fetchedUser = await bDatabaseUpsertUserByIdentification(
      identification,
      user
    );
    const logined = await login({
      provider: "google",
      user: fetchedUser,
    });

    if (!logined) {
      return;
    }

    navigate("/app");
  }, [login, navigate]);

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
