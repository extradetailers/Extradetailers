"use client";

import { usePasswordForgottenOptions } from "@/app/_requests/auth";
import { DefaultError, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { MdLogin } from "react-icons/md";

function ForgottenPasswordForm() {
  const passwordForgottenMutation = useMutation<
    unknown,
    DefaultError,
    FormData
  >(usePasswordForgottenOptions());

  const handleforgottenPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    passwordForgottenMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleforgottenPassword}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control border-primary"
          name="email"
          id="email"
          placeholder="Your Email"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-100 mb-3">
        {" "}
        Reset <MdLogin />
      </button>
      <p className="text-center mb-3">
        Remembered password? <Link href="/signin">Login</Link>
      </p>
    </form>
  );
}

export default ForgottenPasswordForm;
