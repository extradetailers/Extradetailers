import { IServiceCategory, TModuleStyle } from "@/types";
import React, { useMemo, useState } from "react";
import {
  DefaultError,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import Loader from "@/components/elements/Loader";
import Modal from "@/components/elements/Modal";
import ServiceCategoryAdd from "./ServiceCategoryAdd";
import ServiceCategoryCard from "./ServiceCategoryCard";
import { deleteServiceCategoryOptions, useUpdateServiceCategoryOptions, serviceCategoriesOptions } from "@/app/_requests/service-categories";

interface ServiceCategoryListProps {
  styles: TModuleStyle;
}
function ServiceCategoryList({ styles }: ServiceCategoryListProps) {

  const [addOnId, setAddOnId] = useState<number | null>(null);
  
  const queryClient = useQueryClient(); // ✅ React Query Client
  const { data: allServiceCategories } = useQuery(serviceCategoriesOptions);
  const updateServiceCategoryMutation = useMutation<unknown, DefaultError, { id: number; formData: FormData }>(useUpdateServiceCategoryOptions(queryClient));



  const deleteServiceCategoryMutation = useMutation<unknown, DefaultError, number>(
    deleteServiceCategoryOptions(queryClient)
  );

  const handleDeleteServiceCategory = async (
    e: React.SyntheticEvent,
    serviceCategoryId: number
  ) => {
    e.preventDefault();
    await deleteServiceCategoryMutation.mutate(serviceCategoryId);
  };

  const setEditingAddOnId=(e: React.SyntheticEvent, id: number)=>{
    e.preventDefault();
    setAddOnId(id);
  }

  const handleUpdateServiceCategory=(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if(addOnId){
      updateServiceCategoryMutation.mutate({ id: addOnId, formData });
      form.reset();
    }
    setAddOnId(null);
  }

  const selectedServiceCategory = useMemo(()=>{
    if(!addOnId || !allServiceCategories) return null;
    return allServiceCategories.find((aos)=> aos.id === addOnId);
  }, [addOnId, allServiceCategories]);


  if (deleteServiceCategoryMutation.isPending) return <Loader />;

  return (
    <div className="d-flex flex-wrap gap-2 mt-3">
      <Modal
        isOpen={addOnId ? true : false}
        title="Update Vehicle Type"
        submitButtonText="Update"
        children={
          <ServiceCategoryAdd selectedServiceCategory={selectedServiceCategory} />
        }
        onSubmit={handleUpdateServiceCategory}
        onClose={() => setAddOnId(null)}
      /> 
      
      {allServiceCategories && allServiceCategories.map((serviceCategory: IServiceCategory) => (
        <ServiceCategoryCard
          key={serviceCategory.id}
          serviceCategory={serviceCategory}
          styles={styles}
          handleDeleteServiceCategory={handleDeleteServiceCategory}
          setEditingAddOnId={setEditingAddOnId}
        />
      ))}
    </div>
  );
}

export default ServiceCategoryList;
