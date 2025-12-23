import styles from "./service-prices.module.scss";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { servicePricesOptions } from "@/app/_requests/service-prices";
import ServicePriceMain from "@/components/service/service-price/ServicePriceMain";
import { vehicleTypesOptions } from "@/app/_requests/vehicle-types";
import { servicesOptions } from "@/app/_requests/services";

async function ServicePricePage() {

  const queryClient = getQueryClient()

  await  queryClient.prefetchQuery(servicePricesOptions);
  await Promise.all([
    queryClient.prefetchQuery(servicePricesOptions),
    queryClient.prefetchQuery(vehicleTypesOptions),
    queryClient.prefetchQuery(servicesOptions),
  ]);

  return (
    <div className={styles.serviceContainer}>
      <h1 className={styles.title}>Manage Service Price</h1>      
      {/* Service List */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ServicePriceMain styles={styles} />
      </HydrationBoundary>
      
    </div>
  );
}

export default ServicePricePage;