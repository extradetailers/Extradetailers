import { IService, IServicePrice, IVehicleType, TModuleStyle } from "@/types";
import React, { useMemo, useState } from "react";
import {
  DefaultError,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import Loader from "@/components/elements/Loader";
import Modal from "@/components/elements/Modal";
import ServicePriceAdd from "./ServicePriceAdd";
import ServicePriceCard from "./ServicePriceCard";
import { deleteServicePriceOptions, useUpdateServicePriceOptions, servicePricesOptions } from "@/app/_requests/service-prices";

interface ServicePriceListProps {
  styles: TModuleStyle;
  allServices: IService[];
  allVehicleTypes: IVehicleType[];
}
function ServicePriceList({ styles, allServices, allVehicleTypes }: ServicePriceListProps) {

  const [addOnId, setAddOnId] = useState<number | null>(null);
  
  const queryClient = useQueryClient(); // ✅ React Query Client
  const { data: allServicePrices } = useQuery(servicePricesOptions);
  const updateServicePriceMutation = useMutation<unknown, DefaultError, { id: number; formData: FormData }>(useUpdateServicePriceOptions(queryClient));



  const deleteServicePriceMutation = useMutation<unknown, DefaultError, number>(
    deleteServicePriceOptions(queryClient)
  );

  const handleDeleteServicePrice = async (
    e: React.SyntheticEvent,
    servicePriceId: number
  ) => {
    e.preventDefault();
    await deleteServicePriceMutation.mutate(servicePriceId);
  };

  const setEditingAddOnId=(e: React.SyntheticEvent, id: number)=>{
    e.preventDefault();
    setAddOnId(id);
  }

  const handleUpdateServicePrice=(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if(addOnId){
      updateServicePriceMutation.mutate({ id: addOnId, formData });
      form.reset();
    }
    setAddOnId(null);
  }

  const serviceMap: Map<number, IService> = useMemo(()=> {
    if(allServices){
      return new Map(allServices
        .filter(service => service.id !== undefined)
        .map(service => [service.id!, service]));
    }
    return new Map();
  }, [allServices]);

  const selectedServicePrice = useMemo(()=>{
    if(!addOnId || !allServicePrices) return null;
    return allServicePrices.find((aos)=> aos.id === addOnId);
  }, [addOnId, allServicePrices]);


  if (deleteServicePriceMutation.isPending) return <Loader />;

  return (
    <div className="d-flex flex-wrap gap-2 mt-3">
      <Modal
        isOpen={addOnId ? true : false}
        title="Update Service Price"
        submitButtonText="Update"
        children={
          <ServicePriceAdd selectedServicePrice={selectedServicePrice} allServices={allServices} allVehicleTypes={allVehicleTypes} />
        }
        onSubmit={handleUpdateServicePrice}
        onClose={() => setAddOnId(null)}
      /> 
      
      {allServicePrices && allServicePrices.map((servicePrice: IServicePrice) => {
        const service = serviceMap.get(servicePrice.service);
        if (!service) return null;
        return (
          <ServicePriceCard
            key={servicePrice.id}
            service={service}
            servicePrice={servicePrice}
            styles={styles}
            handleDeleteServicePrice={handleDeleteServicePrice}
            setEditingAddOnId={setEditingAddOnId}
          />
        );
      })}
    </div>
  );
}

export default ServicePriceList;
