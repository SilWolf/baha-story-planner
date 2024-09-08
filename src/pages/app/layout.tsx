import { Typography } from "@material-tailwind/react";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="container mx-auto">
      <Typography>App Layout</Typography>
      <Outlet />
    </div>
  );
}
