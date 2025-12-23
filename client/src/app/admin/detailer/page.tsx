import { getUsers, useUsersOptions } from "@/app/_requests/users";
import styles from "./detailer.module.scss";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import DetailerMain from "@/components/detailer/DetailerMain";
import { EUserRole } from "@/types";

async function DetailerPage() {

  const queryClient = getQueryClient();
  const params = { role: EUserRole.DETAILER };

  
  try {
    // Always use await to properly handle errors
    await queryClient.prefetchQuery(useUsersOptions({role: EUserRole.DETAILER}));
  } catch (error) {
    console.error("Prefetch error:", error);
    // The error will automatically propagate to error.tsx
    throw error;
  }


  return (
    <div className={styles.detailerContainer}>
      <h1 className={styles.title}>Manage Detailers</h1>

      {/* Create / Edit Form */}
      
      {/* Detailer List */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DetailerMain styles={styles} />
      </HydrationBoundary>
      
    </div>
  );
}

export default DetailerPage;