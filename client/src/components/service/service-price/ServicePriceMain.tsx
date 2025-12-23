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
import { useCreateServicePriceOptions } from "@/app/_requests/service-prices";
import ServicePriceAdd from "./ServicePriceAdd";
import ServicePriceList from "./ServicePriceList";
import { TModuleStyle } from "@/types";
import { servicesOptions } from "@/app/_requests/services";
import { vehicleTypesOptions } from "@/app/_requests/vehicle-types";

interface ServicePriceMainProps {
  styles: TModuleStyle;
}
function ServicePriceMain({ styles }: ServicePriceMainProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const createServicePriceMutation = useMutation<unknown, DefaultError, FormData>(useCreateServicePriceOptions(queryClient));
  const { data: allServices } = useQuery(servicesOptions);
  const { data: allVehicleTypes } = useQuery(vehicleTypesOptions);


  const handleCreateServicePrice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    createServicePriceMutation.mutate(formData);
    form.reset();
    setIsOpen(false);
  };

  

  if(createServicePriceMutation.isPending) return <Loader />

  return (
    <div className="ServicePriceMain">
      <button className="btn btn-primary d-flex justify-content-center align-items-center gap-1" onClick={() => setIsOpen(!isOpen)}>
        <IoMdAdd size={25} />
        Create New
      </button>
      <Modal
        isOpen={isOpen}
        title="Create a new Service Price"
        submitButtonText="Create"
        children={
          <ServicePriceAdd allServices={allServices || []} allVehicleTypes={allVehicleTypes || []} />
        }
        onSubmit={handleCreateServicePrice}
        onClose={() => setIsOpen(!isOpen)}
      /> 
      <ServicePriceList styles={styles} allServices={allServices || []} allVehicleTypes={allVehicleTypes || []} />
    </div>
  );
}

export default ServicePriceMain;
