"use client";

import {
  usePasswordForgottenOptions,
  useResetPasswordOptions,
} from "@/app/_requests/auth";
import { useMessage } from "@/lib/ToastProvider";
import { DefaultError, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { RiResetRightFill } from "react-icons/ri";

interface IResetPasswordFormProps {
  token: string;
}
function ResetPasswordForm({ token }: IResetPasswordFormProps) {
  const { setMessage } = useMessage();
  const resetPasswordMutation = useMutation<unknown, DefaultError, FormData>(
    useResetPasswordOptions()
  );

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    if (password !== confirmPassword) {
      setMessage({ error: true, text: "Password did not match" });
      return;
    }
    formData.set("token", token);
    resetPasswordMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleResetPassword}>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          New Password
        </label>
        <input
          type="password"
          className="form-control border-primary"
          name="password"
          id="password"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password
        </label>
        <input
          type="password"
          className="form-control border-primary"
          name="confirmPassword"
          id="confirmPassword"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-100 mb-3">
        {" "}
        Reset <RiResetRightFill />
      </button>
      <p className="text-center mb-3">
        Validation link expired? <Link href="/forgotten-password">Send again</Link>
      </p>
      <p className="text-center mb-3">
        Remembered password? <Link href="/signin">Login</Link>
      </p>
    </form>
  );
}

export default ResetPasswordForm;
