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
import { serviceFullDataOptions, useCreateServiceOptions } from "@/app/_requests/services";
import ServiceAdd from "./ServiceAdd";
import ServiceList from "./ServiceList";
import { TModuleStyle } from "@/types";

interface ServiceMainProps {
  styles: TModuleStyle;
}
function ServiceMain({ styles }: ServiceMainProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const createServiceMutation = useMutation<unknown, DefaultError, FormData>(useCreateServiceOptions(queryClient));

  const {data: serviceFullData} = useQuery(serviceFullDataOptions);


  const handleCreateService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    createServiceMutation.mutate(formData);
    form.reset();
    setIsOpen(false);
  };

  if(createServiceMutation.isPending) return <Loader />


  return (
    <div className="ServiceMain">
      <button className="btn btn-primary d-flex justify-content-center align-items-center gap-1" onClick={() => setIsOpen(!isOpen)}>
        <IoMdAdd size={25} />
        Create New
      </button>
      <Modal
        isOpen={isOpen}
        title="Create a new Service"
        submitButtonText="Create"
        children={
          <ServiceAdd serviceCategories={serviceFullData?.service_categories || []} serviceFixtures={serviceFullData?.service_features || []} servicePrices={serviceFullData?.service_prices || []}  />
        }
        onSubmit={handleCreateService}
        onClose={() => setIsOpen(!isOpen)}
      /> 
      <ServiceList styles={styles} />
    </div>
  );
}

export default ServiceMain;
