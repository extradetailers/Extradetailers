import { useUsersOptions } from "@/app/_requests/users";
import styles from "./user.module.scss";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import UserMain from "@/components/user/UserMain";

async function UserPage() {

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(useUsersOptions());

  return (
    <div className={styles.userContainer}>
      <h1 className={styles.title}>Manage Users</h1>
      
      {/* Create / Edit Form */}
      
      {/* User List */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserMain styles={styles} />
      </HydrationBoundary>
      
    </div>
  );
}

export default UserPage;