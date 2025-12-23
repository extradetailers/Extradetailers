"use client";

import { TModuleStyle } from "@/types";
import React, { useState } from "react";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

interface IPaymentCardProps {
  total: number;
  styles: TModuleStyle;
  clientSecret: string | null;
  subTotal: number;
  tax: number;
}

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
// This is a public sample test API key.
// Don't submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripePromise = loadStripe(
  "pk_test_51E42CcE15Lqo4v04FHj1EOv6iAY09udHeoDXN1JN10OcnBN0Ifx002HhH6mGQCxTTJiE1kKQeK6FAD721vg3dflD00a6EctJsj"
);

function PaymentCard({ total, styles, clientSecret, tax, subTotal }: IPaymentCardProps) {
  const appearance: Appearance = {
    theme: "stripe" as const,
  };
  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";

  return (
    <div className={`card border-0 shadow-sm ${styles.glassEffect} p-3`}>
      <div className="card-body">
        <h4 className="card-title mb-4 border-bottom pb-2">🧾 Order Summary</h4>
        <div className="d-flex justify-content-between mb-3">
          <span className="text-muted">Subtotal</span>
          <span>${subTotal}</span>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <span className="text-muted">Tax</span>
          <span>$${tax}</span>
        </div>
        <div className="d-flex justify-content-between mb-4 fw-bold fs-5">
          <span>Total</span>
          <span>${total}</span>
        </div>
        <div className="d-grid gap-3">
          {clientSecret && (
            <Elements
              options={{ clientSecret, appearance, loader }}
              stripe={stripePromise}
            >
              <CheckoutForm />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentCard;
