import { redirect } from "next/navigation";
import { validateUser } from "@/app/_requests/auth";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ValidateUserPage({
  searchParams,
}: PageProps) {
  const { token } = await searchParams;

  const validationResult = await validateUser(token);

  if(!validationResult.isError){
    redirect("/signin");
  }

  return (
    <div>
      <h1>Validating User...</h1>
      {validationResult?.message && (
        <div style={{ color: validationResult?.isError ? "red" : "green", fontWeight: "bold" }}>
          {validationResult.message}
        </div>
      )}
      {validationResult.isError && (<Link href="/signup">Go to register</Link>)}
    </div>
  );
}

