"use client";

import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  DefaultError,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Loader from "@/components/elements/Loader";
import Modal from "@/components/elements/Modal";
import { useCreateServiceCategoryOptions } from "@/app/_requests/service-categories";
import ServiceCategoryAdd from "./ServiceCategoryAdd";
import ServiceCategoryList from "./ServiceCategoryList";
import { TModuleStyle } from "@/types";

interface ServiceCategoryMainProps {
  styles: TModuleStyle;
}
function ServiceCategoryMain({ styles }: ServiceCategoryMainProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const createServiceCategoryMutation = useMutation<unknown, DefaultError, FormData>(useCreateServiceCategoryOptions(queryClient));


  const handleCreateServiceCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    createServiceCategoryMutation.mutate(formData);
    form.reset();
    setIsOpen(false);
  };

  if(createServiceCategoryMutation.isPending) return <Loader />

  return (
    <div className="ServiceCategoryMain">
      <button className="btn btn-primary d-flex justify-content-center align-items-center gap-1" onClick={() => setIsOpen(!isOpen)}>
        <IoMdAdd size={25} />
        Create New
      </button>
      <Modal
        isOpen={isOpen}
        title="Create a new Service Category"
        submitButtonText="Create"
        children={
          <ServiceCategoryAdd />
        }
        onSubmit={handleCreateServiceCategory}
        onClose={() => setIsOpen(!isOpen)}
      /> 
      <ServiceCategoryList styles={styles} />
    </div>
  );
}

export default ServiceCategoryMain;
