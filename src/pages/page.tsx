import { Button, Card } from "react-daisyui";

export default function RootLandingPage() {
  return (
    <div className="container mx-auto text-center flex items-center justify-center h-screen">
      <Card>
        <Card.Body>
          <div className="space-y-2">
            <a href="/app/stories/1">
              <Button fullWidth variant="outline">
                以 Google 帳號登入
              </Button>
            </a>
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
