import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

export default function RootLandingPage() {
  return (
    <div className="container mx-auto text-center flex items-center justify-center">
      <Card className="mt-6 w-96">
        <CardBody>
          <Typography variant="h5" className="mb-2">
            登入
          </Typography>
        </CardBody>
        <CardFooter className="pt-0">
          <Button fullWidth>登入</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
