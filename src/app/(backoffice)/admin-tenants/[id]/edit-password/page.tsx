// app/admin-tenants/[id]/edit-password/page.tsx

import EditAdminTenantPasswordClient from "./EditAdminTenantPasswordClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditAdminTenantPasswordClient id={id} />;
}