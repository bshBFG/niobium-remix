import type { LoaderFunction } from "remix";
import { json, Outlet } from "remix";

import { SidebarProvider } from "~/components/dashboard/sidebar-context";
import { DashboardLayout } from "~/components/dashboard/layout";
import { requireUserRole } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserRole(request, ["ADMIN"]);

  return json({});
};

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </SidebarProvider>
  );
}
