import styles from "./service-feature.module.scss";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ServiceFeatureMain from "@/components/service/service-feature/ServiceFeatureMain";
import { serviceFeaturesOptions } from "@/app/_requests/service-feature";
import { servicesOptions } from "@/app/_requests/services";

async function ServiceFeaturePage() {

  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery(serviceFeaturesOptions),
    queryClient.prefetchQuery(servicesOptions),
  ]);

  return (
    <div className={styles.serviceContainer}>
      <h1 className={styles.title}>Manage Service Feature</h1>      
      {/* Service List */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ServiceFeatureMain styles={styles} />
      </HydrationBoundary>
      
    </div>
  );
}

export default ServiceFeaturePage;