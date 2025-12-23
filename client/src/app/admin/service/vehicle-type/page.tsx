import styles from "./vehicle-type.module.scss";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { vehicleTypesOptions } from "@/app/_requests/vehicle-types";
import VehicleTypeMain from "@/components/service/vehicle-type/VehicleTypeMain";

async function VehicleTypePage() {

  const queryClient = getQueryClient()

  await  queryClient.prefetchQuery(vehicleTypesOptions);

  return (
    <div className={styles.serviceContainer}>
      <h1 className={styles.title}>Manage Vehicle Type</h1>      
      {/* Service List */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <VehicleTypeMain styles={styles} />
      </HydrationBoundary>
      
    </div>
  );
}

export default VehicleTypePage;