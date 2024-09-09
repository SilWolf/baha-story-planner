import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="container mx-auto">
      <p>App Layout</p>
      <Outlet />
    </div>
  );
}
