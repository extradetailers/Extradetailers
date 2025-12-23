import { serviceFullDataOptions, servicesOptions } from "@/app/_requests/services";
import styles from "./service.module.scss";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ServiceMain from "@/components/service/ServiceMain";

async function ServicePage() {

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(serviceFullDataOptions);

  return (
    <div className={styles.serviceContainer}>
      <h1 className={styles.title}>Manage Services</h1>
      
      {/* Create / Edit Form */}
      
      {/* Service List */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ServiceMain styles={styles} />
      </HydrationBoundary>
      
    </div>
  );
}

export default ServicePage;