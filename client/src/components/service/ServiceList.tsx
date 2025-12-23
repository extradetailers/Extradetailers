import { IService, IServiceCategory, TModuleStyle } from "@/types";
import React, { useMemo, useState } from "react";
import {
  DefaultError,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import Loader from "@/components/elements/Loader";
import Modal from "@/components/elements/Modal";
import ServiceAdd from "./ServiceAdd";
import ServiceCard from "./ServiceCard";
import { deleteServiceOptions, useUpdateServiceOptions, servicesOptions, serviceFullDataOptions } from "@/app/_requests/services";

interface ServiceListProps {
  styles: TModuleStyle;
}
function ServiceList({ styles }: ServiceListProps) {

  const [serviceId, setServiceId] = useState<number | null>(null);
  
  const queryClient = useQueryClient(); // ✅ React Query Client
  const {data: serviceFullData} = useQuery(serviceFullDataOptions);
  const updateServiceMutation = useMutation<unknown, DefaultError, { id: number; formData: FormData }>(useUpdateServiceOptions(queryClient));



  const deleteServiceMutation = useMutation<unknown, DefaultError, number>(
    deleteServiceOptions(queryClient)
  );

  const handleDeleteService = async (
    e: React.SyntheticEvent,
    serviceId: number
  ) => {
    e.preventDefault();
    await deleteServiceMutation.mutate(serviceId);
  };

  const setEditingServiceId=(e: React.SyntheticEvent, id: number)=>{
    e.preventDefault();
    setServiceId(id);
  }

  const handleUpdateService=(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if(serviceId){
      updateServiceMutation.mutate({ id: serviceId, formData });
      form.reset();
    }
    setServiceId(null);
  }

  const selectedService = useMemo(()=>{
    if(!serviceId || !serviceFullData) return null;
    return serviceFullData.services.find((aos)=> aos.id === serviceId);
  }, [serviceId, serviceFullData]);


  if (deleteServiceMutation.isPending) return <Loader />;

  return (
    <div className="d-flex flex-wrap gap-2 mt-3">
      <Modal
        isOpen={serviceId ? true : false}
        title="Update Vehicle Type"
        submitButtonText="Update"
        children={
          <ServiceAdd selectedService={selectedService} serviceCategories={[]} serviceFixtures={[]} servicePrices={[]} />
        }
        onSubmit={handleUpdateService}
        onClose={() => setServiceId(null)}
      /> 
      
      {serviceFullData && serviceFullData.services && serviceFullData.services.map((service: IService) => (
        <ServiceCard
          key={service.id}
          service={service}
          styles={styles}
          handleDeleteService={handleDeleteService}
          setEditingServiceId={setEditingServiceId}
        />
      ))}
    </div>
  );
}

export default ServiceList;
