import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/reset-password">) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : (params.token ?? undefined);

  return <ResetPasswordForm token={token} />;
}