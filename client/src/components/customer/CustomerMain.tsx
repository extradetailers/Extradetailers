"use client";

import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  DefaultError,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Loader from "@/components/elements/Loader";
import Modal from "@/components/elements/Modal";
import CustomerAdd from "./CustomerAdd";
import CustomerList from "./CustomerList";
import { EUserRole, TModuleStyle } from "@/types";
import { useMessage } from "@/lib/ToastProvider";
import { userBoolFields } from "@/utils/staticData";
import { useCreateUserOptions, useUsersOptions } from "@/app/_requests/users";

interface CustomerMainProps {
  styles: TModuleStyle;
}
function CustomerMain({ styles }: CustomerMainProps) {
  const {setMessage} = useMessage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const createCustomerMutation = useMutation<unknown, DefaultError, FormData>(useCreateUserOptions(queryClient));

  const {data: userList} = useQuery(useUsersOptions({role: EUserRole.CUSTOMER}));


  const handleCreateCustomer = (e: React.FormEvent<HTMLFormElement>) => {
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
  
    createCustomerMutation.mutate(formData);
    form.reset();
    setIsOpen(false);
  };

  if(createCustomerMutation.isPending) return <Loader />


  return (
    <div className="CustomerMain">
      <button className="btn btn-primary d-flex justify-content-center align-items-center gap-1" onClick={() => setIsOpen(!isOpen)}>
        <IoMdAdd size={25} />
        Create New
      </button>
      <Modal
        isOpen={isOpen}
        title="Create a new Customer"
        submitButtonText="Create"
        children={
          <CustomerAdd
          roles={[EUserRole.ADMIN, EUserRole.CUSTOMER, EUserRole.DETAILER]}
          groups={[]}
          permissions={[]}  />
        }
        onSubmit={handleCreateCustomer}
        onClose={() => setIsOpen(!isOpen)}
      /> 
      <CustomerList styles={styles} userList={userList || []} />
    </div>
  );
}

export default CustomerMain;
