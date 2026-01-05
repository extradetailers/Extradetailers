import { IUser, TModuleStyle } from "@/types";
import React, { useMemo, useState } from "react";
import {
  DefaultError,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import Loader from "@/components/elements/Loader";
import Modal from "@/components/elements/Modal";
import UserAdd from "./DetailerAdd";
import UserCard from "./DetailerCard";
import { useDeleteUserOptions, useUpdateUserOptions } from "@/app/_requests/users";

interface UserListProps {
  styles: TModuleStyle;
  userList: IUser[];
}
function UserList({ styles, userList }: UserListProps) {

  const [userId, setUserId] = useState<number | null>(null);
  
  const queryClient = useQueryClient(); // ✅ React Query Client
  const updateUserMutation = useMutation<unknown, DefaultError, { id: number; formData: FormData }>(useUpdateUserOptions(queryClient));



  const deleteUserMutation = useMutation<unknown, DefaultError, number>(
    useDeleteUserOptions(queryClient)
  );

  const handleDeleteUser = async (
    e: React.SyntheticEvent,
    userId: number
  ) => {
    e.preventDefault();
    await deleteUserMutation.mutate(userId);
  };

  const setEditingUserId=(e: React.SyntheticEvent, id: number)=>{
    e.preventDefault();
    setUserId(id);
  }

  const handleUpdateUser=(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if(userId){
      updateUserMutation.mutate({ id: userId, formData });
      form.reset();
    }
    setUserId(null);
  }

  const selectedUser = useMemo(()=>{
    if(!userId || !userList) return null;
    return userList.find((aos)=> aos.id === userId);
  }, [userId, userList]);


  if (deleteUserMutation.isPending) return <Loader />;

  return (
    <div className="d-flex flex-wrap gap-2 mt-3">
      {/* <Modal
        isOpen={userId ? true : false}
        title="Update Vehicle Type"
        submitButtonText="Update"
        children={
          <UserAdd selectedUser={selectedUser} userCategories={[]} userFixtures={[]} userPrices={[]} />
        }
        onSubmit={handleUpdateUser}
        onClose={() => setUserId(null)}
      />  */}
      
      {userList && userList.map((user: IUser) => (
        <UserCard
          key={user.id}
          user={user}
          styles={styles}
          handleDeleteUser={handleDeleteUser}
          setEditingUserId={setEditingUserId}
        />
      ))}
    </div>
  );
}

export default UserList;
