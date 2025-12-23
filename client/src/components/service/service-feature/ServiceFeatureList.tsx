import { IServiceFeature, IServiceCategory, IService } from "@/types";
import React, { useMemo, useState } from "react";
import {
  DefaultError,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import Loader from "@/components/elements/Loader";
import Modal from "@/components/elements/Modal";
import ServiceFeatureAdd from "./ServiceFeatureAdd";
import { deleteServiceFeatureOptions, serviceFeaturesOptions, useUpdateServiceFeatureOptions } from "@/app/_requests/service-feature";
import ServiceFeatureCard from "./ServiceFeatureCard";

interface ServiceFeatureListProps {
  styles: Record<string, string>;
  allServices: IService[];
}
function ServiceFeatureList({ styles, allServices }: ServiceFeatureListProps) {

  const [addOnId, setAddOnId] = useState<number | null>(null);
  
  const queryClient = useQueryClient(); // ✅ React Query Client
  const { data: allServiceFeatures } = useQuery(serviceFeaturesOptions);
  const updateServiceFeatureMutation = useMutation<unknown, DefaultError, { id: number; formData: FormData }>(useUpdateServiceFeatureOptions(queryClient));



  const deleteServiceFeatureMutation = useMutation<unknown, DefaultError, number>(
    deleteServiceFeatureOptions(queryClient)
  );

  const handleDeleteServiceFeature = async (
    e: React.SyntheticEvent,
    serviceFeatureId: number
  ) => {
    e.preventDefault();
    await deleteServiceFeatureMutation.mutate(serviceFeatureId);
  };

  const setEditingAddOnId=(e: React.SyntheticEvent, id: number)=>{
    e.preventDefault();
    setAddOnId(id);
  }

  const handleUpdateServiceFeature=(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if(addOnId){
      updateServiceFeatureMutation.mutate({ id: addOnId, formData });
      form.reset();
    }
    setAddOnId(null);
  }

  const selectedServiceFeature = useMemo(()=>{
    if(!addOnId || !allServiceFeatures) return null;
    return allServiceFeatures.find((aos)=> aos.id === addOnId);
  }, [addOnId, allServiceFeatures]);

  const serviceMap: Map<number, IService> = useMemo(()=> {
    if(allServices){
      return new Map(allServices
        .filter(service => service.id !== undefined)
        .map(service => [service.id!, service]));
    }
    return new Map();
  }, [allServices]);

  if (deleteServiceFeatureMutation.isPending) return <Loader />;

  return (
    <div className="d-flex flex-wrap gap-2 mt-3">
      <Modal
        isOpen={addOnId ? true : false}
        title="Update add-on service"
        submitButtonText="Update"
        children={
          <ServiceFeatureAdd allServices={allServices} selectedFeatureService={selectedServiceFeature} />
        }
        onSubmit={handleUpdateServiceFeature}
        onClose={() => setAddOnId(null)}
      /> 
      
      {allServiceFeatures && allServiceFeatures.map((serviceFeature: IServiceFeature) => (
        <ServiceFeatureCard
          key={serviceFeature.id}
          serviceFeature={serviceFeature}
          service={serviceMap.get(serviceFeature.service)}
          styles={styles}
          handleDeleteServiceFeature={handleDeleteServiceFeature}
          setEditingAddOnId={setEditingAddOnId}
        />
      ))}
    </div>
  );
}

export default ServiceFeatureList;
