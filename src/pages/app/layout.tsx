import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="container mx-auto py-24">
      <p>App Layout</p>
      <Outlet />
    </div>
  );
}
