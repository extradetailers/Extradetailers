import styles from "./service-categories.module.scss";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { serviceCategoriesOptions } from "@/app/_requests/service-categories";
import ServiceCategoryMain from "@/components/service/service-category/ServiceCategoryMain";

async function ServiceCategoryPage() {

  const queryClient = getQueryClient()

  await  queryClient.prefetchQuery(serviceCategoriesOptions);

  return (
    <div className={styles.serviceContainer}>
      <h1 className={styles.title}>Manage Service Category</h1>      
      {/* Service List */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ServiceCategoryMain styles={styles} />
      </HydrationBoundary>
      
    </div>
  );
}

export default ServiceCategoryPage;