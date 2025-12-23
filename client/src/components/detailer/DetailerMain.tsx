"use client";

import React, { useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  DefaultError,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Loader from "@/components/elements/Loader";
import Modal from "@/components/elements/Modal";
import { useCreateUserOptions, useUsersOptions } from "@/app/_requests/users";
import UserAdd from "./DetailerAdd";
import UserList from "./DetailerList";
import { EUserRole, TModuleStyle } from "@/types";
import { useMessage } from "@/lib/ToastProvider";
import { userBoolFields } from "@/utils/staticData";

interface UserMainProps {
  styles: TModuleStyle;
}
function UserMain({ styles }: UserMainProps) {
  const {setMessage} = useMessage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const createUserMutation = useMutation<unknown, DefaultError, FormData>(useCreateUserOptions(queryClient));

  const {data: userList} = useQuery(useUsersOptions());


  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
  
    // Check passwords match
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirm_password")?.toString() || "";
  
    if (password !== confirmPassword) {
      setMessage({ error: true, text: "Password did not match" });
      return;
    }
  
    // Remove confirm password
    formData.delete("confirm_password");
  
    // Convert boolean fields explicitly to "true"/"false" strings
    userBoolFields.forEach((field) => {
      // FormData only contains the field if checkbox is checked ("on")
      if (formData.has(field)) {
        formData.set(field, "true");
      } else {
        formData.set(field, "false");
      }
    });

    formData.set("username", formData.get("email")?.toString() || "");
  
    createUserMutation.mutate(formData);
    form.reset();
    setIsOpen(false);
  };

  const detailerUsers = useMemo(()=>{
    if(!userList) return [];
    const newUsers = userList.filter(u=> u.role === EUserRole.DETAILER);
    return newUsers;
  }, [userList]);

  if(createUserMutation.isPending) return <Loader />


  return (
    <div className="UserMain">
      <button className="btn btn-primary d-flex justify-content-center align-items-center gap-1" onClick={() => setIsOpen(!isOpen)}>
        <IoMdAdd size={25} />
        Create New
      </button>
      <Modal
        isOpen={isOpen}
        title="Create a new User"
        submitButtonText="Create"
        children={
          <UserAdd
          roles={[EUserRole.ADMIN, EUserRole.CUSTOMER, EUserRole.DETAILER]}
          groups={[]}
          permissions={[]}  />
        }
        onSubmit={handleCreateUser}
        onClose={() => setIsOpen(!isOpen)}
      /> 
      <UserList styles={styles} userList={detailerUsers || []} />
    </div>
  );
}

export default UserMain;
