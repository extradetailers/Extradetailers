import Footer from "@/components/layout/Footer";
import React from "react";
import styles from "./packages.module.scss";
import Landing from "@/components/layout/Landing";
import PackageList from "@/components/packages/PackageList";
import { getQueryClient } from "@/lib/get-query-client";
import { combinedServicesOptions } from "../_requests/services";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AddOnServiceList from "@/components/packages/AddOnServiceList";
import PackageSelectionSidebar from "@/components/packages/PackageSelectionSidebar";

export default async function PackagesPage() {
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(combinedServicesOptions);
  } catch (error) {
    console.error("Prefetch error:", error);
    throw error; // propagate to /error
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <main>
        <section className={styles.landing}>
          <Landing title="Packages" />
        </section>

        <section className="section-pt">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-4 fw-bold text-primary">
                Premium Car Detailing Services
              </h2>
              <p className="lead text-muted">
                Restore your vehicle's showroom shine with our expert care
              </p>
              <div className="d-flex justify-content-center gap-3">
                <span className="badge bg-primary rounded-pill px-3 py-2">
                  <i className="bi bi-shield-check me-1"></i> Certified
                  Technicians
                </span>
                <span className="badge bg-success rounded-pill px-3 py-2">
                  <i className="bi bi-star-fill me-1"></i> 5-Star Rated
                </span>
                <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                  <i className="bi bi-award-fill me-1"></i> Eco-Friendly
                </span>
              </div>
            </div>

            <HydrationBoundary state={dehydratedState}>
              <div className="row g-4">
                <div className="col-lg-8 booking-lg-1 booking-2">
                  <ul
                    className="nav nav-pills mb-4 justify-content-center"
                    id="servicesTab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="packages-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#packages"
                        type="button"
                        role="tab"
                      >
                        Main Packages
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="addons-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#addons"
                        type="button"
                        role="tab"
                      >
                        Add-On Services
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content" id="servicesTabContent">
                    <PackageList styles={styles} />
                    <AddOnServiceList styles={styles} />
                  </div>
                </div>

                <div className="col-lg-4 booking-lg-2 booking-1">
                  <PackageSelectionSidebar styles={styles} />
                </div>
              </div>
            </HydrationBoundary>
          </div>
        </section>

        <section className="section-pt"></section>
      </main>
      <Footer />
    </>
  );
}
