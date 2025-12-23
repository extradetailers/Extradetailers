import React from "react";
import styles from "./forgotten-password.module.scss";
import Link from "next/link";
import Image from "next/image";
import { MdLogin } from "react-icons/md";
import ForgottenPasswordForm from "@/components/auth/ForgottenPasswordForm";

function ForgottenPasswordPage() {
  
  return (
    <main className={`${styles.forgottenPassword || ""} w-100 d-flex align-items-center justify-content-center`}>
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
          <p className="mb-4">Welcome to Extradetailer - Forgotten Password </p>
          <hr className="mb-4 border border-primary" />
          <ForgottenPasswordForm />
        </div>
      </div>
    </main>
  );
}

export default ForgottenPasswordPage;
