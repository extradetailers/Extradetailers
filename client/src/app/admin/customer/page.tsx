import { useUsersOptions } from "@/app/_requests/users";
import styles from "./customer.module.scss";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { EUserRole } from "@/types";
import CustomerMain from "@/components/customer/CustomerMain";

async function CustomerPage() {

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(useUsersOptions({ role: EUserRole.DETAILER }));

  return (
    <div className={styles.customerContainer}>
      <h1 className={styles.title}>Manage Customers</h1>
      
      {/* Create / Edit Form */}
      
      {/* Customer List */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CustomerMain styles={styles} />
      </HydrationBoundary>
      
    </div>
  );
}

export default CustomerPage;