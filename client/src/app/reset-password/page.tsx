import React from "react";
import styles from "./reset-password.module.scss";
import Link from "next/link";
import Image from "next/image";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { notFound } from "next/navigation";

interface IResetPasswordPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
async function ResetPasswordPage({ searchParams }: IResetPasswordPageProps) {
  const token = (await searchParams).token;
  if (!token) {
    notFound();
  }

  return (
    <main
      className={`${
        styles.resetPassword || ""
      } w-100 d-flex align-items-center justify-content-center`}
    >
      {/* Let&apos;s access to your account */}
      <div className="col col-md-5 d-flex flex-column justify-content-center">
        <div
          className={`${styles.contentBox} shadow p-3 mb-5 bg-body-tertiary`}
        >
          <Link className="navbar-brand mb-4" href="/">
            <Image
              height={100}
              width={100}
              alt="extra-detailers-logo"
              src="/logo.png"
              className={styles.headerLogo}
            />
          </Link>
          <h2 className="mb-3">Get Started</h2>
          <p className="mb-4">Welcome to Extradetailer - Reset Password </p>
          <hr className="mb-4 border border-primary" />
          <ResetPasswordForm token={token as string} />
        </div>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
