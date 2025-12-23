import styles from "./add-on-service.module.scss";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AddOnServiceMain from "@/components/service/add-on-service/AddOnServiceMain";
import { addOnServicesOptions } from "@/app/_requests/add-on-services";
import { serviceCategoriesOptions } from "@/app/_requests/service-categories";

async function AddOnServicePage() {

  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery(addOnServicesOptions),
    queryClient.prefetchQuery(serviceCategoriesOptions)
  ]);

  return (
    <div className={styles.serviceContainer}>
      <h1 className={styles.title}>Manage Add-ons Services</h1>      
      {/* Service List */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AddOnServiceMain styles={styles} />
      </HydrationBoundary>
      
    </div>
  );
}

export default AddOnServicePage;