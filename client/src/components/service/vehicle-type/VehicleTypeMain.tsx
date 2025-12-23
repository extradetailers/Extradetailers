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
import { useCreateVehicleTypeOptions } from "@/app/_requests/vehicle-types";
import VehicleTypeAdd from "./VehicleTypeAdd";
import VehicleTypeList from "./VehicleTypeList";
import { TModuleStyle } from "@/types";

interface VehicleTypeMainProps {
  styles: TModuleStyle;
}
function VehicleTypeMain({ styles }: VehicleTypeMainProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const createVehicleTypeMutation = useMutation<unknown, DefaultError, FormData>(useCreateVehicleTypeOptions(queryClient));


  const handleCreateVehicleType = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    createVehicleTypeMutation.mutate(formData);
    form.reset();
    setIsOpen(false);
  };

  if(createVehicleTypeMutation.isPending) return <Loader />

  return (
    <div className="VehicleTypeMain">
      <button className="btn btn-primary d-flex justify-content-center align-items-center gap-1" onClick={() => setIsOpen(!isOpen)}>
        <IoMdAdd size={25} />
        Create New
      </button>
      <Modal
        isOpen={isOpen}
        title="Create a new Vehicle Type"
        submitButtonText="Create"
        children={
          <VehicleTypeAdd />
        }
        onSubmit={handleCreateVehicleType}
        onClose={() => setIsOpen(!isOpen)}
      /> 
      <VehicleTypeList styles={styles} />
    </div>
  );
}

export default VehicleTypeMain;
