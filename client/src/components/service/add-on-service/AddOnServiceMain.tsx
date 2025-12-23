"use client";

import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  DefaultError,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import {
  useCreateAddOnServiceOptions,
} from "@/app/_requests/add-on-services";
import Loader from "@/components/elements/Loader";
import AddOnServiceList from "./AddOnServiceList";
import Modal from "@/components/elements/Modal";
import { serviceCategoriesOptions } from "@/app/_requests/service-categories";
import AddOnServiceAdd from "./AddOnServiceAdd";

interface AddOnServiceMainProps {
  styles: Record<string, string>;
}
function AddOnServiceMain({ styles }: AddOnServiceMainProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const createAddOnServiceMutation = useMutation<unknown, DefaultError, FormData>(useCreateAddOnServiceOptions(queryClient));
  const { data: allServiceCategories } = useQuery(
    serviceCategoriesOptions
  );


  const handleCreateAddOnService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    createAddOnServiceMutation.mutate(formData);
    form.reset();
    setIsOpen(false);
  };

  if(createAddOnServiceMutation.isPending || !allServiceCategories) return <Loader />

  return (
    <div className="AddOnServiceMain">
      <button className="btn btn-primary d-flex justify-content-center align-items-center gap-1" onClick={() => setIsOpen(!isOpen)}>
        <IoMdAdd size={25} />
        Create New
      </button>
      <Modal
        isOpen={isOpen}
        title="Create a new add-on service"
        submitButtonText="Create"
        children={
          <AddOnServiceAdd allServiceCategories={allServiceCategories} />
        }
        onSubmit={handleCreateAddOnService}
        onClose={() => setIsOpen(!isOpen)}
      />

      <AddOnServiceList styles={styles} allServiceCategories={allServiceCategories} />
    </div>
  );
}

export default AddOnServiceMain;
