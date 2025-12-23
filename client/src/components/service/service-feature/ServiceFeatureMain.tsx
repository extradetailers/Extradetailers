"use client";

import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  DefaultError,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import Loader from "@/components/elements/Loader";
import Modal from "@/components/elements/Modal";
import { serviceCategoriesOptions } from "@/app/_requests/service-categories";
import { useCreateServiceFeatureOptions } from "@/app/_requests/service-feature";
import ServiceFeatureAdd from "./ServiceFeatureAdd";
import ServiceFeatureList from "./ServiceFeatureList";
import { servicesOptions } from "@/app/_requests/services";

interface ServiceFeatureMainProps {
  styles: Record<string, string>;
}
function ServiceFeatureMain({ styles }: ServiceFeatureMainProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const createServiceFeatureMutation = useMutation<
    unknown,
    DefaultError,
    FormData
  >(useCreateServiceFeatureOptions(queryClient));
  const { data: allServices } = useQuery(servicesOptions);

  const handleCreateServiceFeature = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    createServiceFeatureMutation.mutate(formData);
    form.reset();
    setIsOpen(false);
  };

  if (createServiceFeatureMutation.isPending) return <Loader />;

  return (
    <div className="ServiceFeatureMain">
      <button
        className="btn btn-primary d-flex justify-content-center align-items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoMdAdd size={25} />
        Create New
      </button>

      {allServices && (
        <>
          <Modal
            isOpen={isOpen}
            title="Create a new feature service"
            submitButtonText="Create"
            children={<ServiceFeatureAdd allServices={allServices} />}
            onSubmit={handleCreateServiceFeature}
            onClose={() => setIsOpen(!isOpen)}
          />
          <ServiceFeatureList styles={styles} allServices={allServices} />
        </>
      )}
    </div>
  );
}

export default ServiceFeatureMain;
