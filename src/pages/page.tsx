import { useCallback } from "react";
import { Button, Card } from "react-daisyui";

import { useAuth } from "@/providers/AuthProvider";
import { useFirebase } from "@/providers/FirebaseProvider";

export default function RootLandingPage() {
  const {
    action: { login },
  } = useAuth();
  const { auth: firebaseAuth } = useFirebase();

  const handleClickGoogleLogin = useCallback(() => {
    firebaseAuth.login().then((user) => {
      if (!user?.email) {
        return;
      }

      login({
        provider: "google",
        email: user.email,
      });
    });
  }, [firebaseAuth, login]);

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
