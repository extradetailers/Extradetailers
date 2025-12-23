/*
https://docs.stripe.com/payments/quickstart?client=react&lang=python
*/

import styles from "./checkout.module.scss";
import { getQueryClient } from "@/lib/get-query-client";
import Checkout from "@/components/checkout/Checkout";
import { combinedServicesOptions, servicesOptions } from "../../_requests/services";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

async function CheckoutPage() {
  // Fetch all services
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(combinedServicesOptions);
  } catch (error) {
    console.error("Prefetch error:", error);
    throw error; // propagate to /error
  }

  return (
    <>
      <header className="bg-white shadow-sm py-3 mb-4">
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand" href="/">
            <Image
              height={100}
              width={100}
              alt="extra-detailers-logo"
              src="/logo.png"
              className={styles.headerLogo}
            />
          </Link>
          <Link className="btn btn-outline-primary" href="/">
            ← Go Back
          </Link>
        </div>
      </header>
      <main className={`${styles.checkout} w-100 vh-100 d-flex flex-column`}>
        {/* Hero Section */}
        {/* <section className={styles.landing}>
          <Landing title="Checkout" />
        </section> */}

        <section className="flex-grow-1 py-5">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Checkout styles={styles} />
          </HydrationBoundary>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default CheckoutPage;
