import { IAddOnService, IServiceCategory } from "@/types";
import React, { useMemo, useState } from "react";
import AddOnServiceCard from "./AddOnServiceCard";
import {
  DefaultError,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import {
  addOnServicesOptions,
  deleteAddOnServiceOptions,
  useUpdateAddOnServiceOptions,
} from "@/app/_requests/add-on-services";
import Loader from "@/components/elements/Loader";
import Modal from "@/components/elements/Modal";
import AddOnServiceAdd from "./AddOnServiceAdd";

interface AddOnServiceListProps {
  styles: Record<string, string>;
  allServiceCategories: IServiceCategory[];
}
function AddOnServiceList({ styles, allServiceCategories }: AddOnServiceListProps) {

  const [addOnId, setAddOnId] = useState<number | null>(null);
  
  const queryClient = useQueryClient(); // ✅ React Query Client
  const { data: allAddOnServices } = useQuery(addOnServicesOptions);
  const updateAddOnServiceMutation = useMutation<unknown, DefaultError, { id: number; formData: FormData }>(useUpdateAddOnServiceOptions(queryClient));



  const deleteAddOnServiceMutation = useMutation<unknown, DefaultError, number>(
    deleteAddOnServiceOptions(queryClient)
  );

  const handleDeleteAddOnService = async (
    e: React.SyntheticEvent,
    addOnServiceId: number
  ) => {
    e.preventDefault();
    await deleteAddOnServiceMutation.mutate(addOnServiceId);
  };

  const setEditingAddOnId=(e: React.SyntheticEvent, id: number)=>{
    e.preventDefault();
    setAddOnId(id);
  }

  const handleUpdateAddOnService=(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if(addOnId){
      updateAddOnServiceMutation.mutate({ id: addOnId, formData });
      form.reset();
    }
    setAddOnId(null);
  }

  const selectedAddOnService = useMemo(()=>{
    if(!addOnId || !allAddOnServices) return null;
    return allAddOnServices.find((aos)=> aos.id === addOnId);
  }, [addOnId, allAddOnServices]);

  if (deleteAddOnServiceMutation.isPending) return <Loader />;

  return (
    <div className="d-flex flex-wrap gap-2 mt-3">
      <Modal
        isOpen={addOnId ? true : false}
        title="Update add-on service"
        submitButtonText="Update"
        children={
          <AddOnServiceAdd allServiceCategories={allServiceCategories} selectedAddOnService={selectedAddOnService} />
        }
        onSubmit={handleUpdateAddOnService}
        onClose={() => setAddOnId(null)}
      />
      
      {allAddOnServices && allAddOnServices.map((addOnService: IAddOnService) => (
        <AddOnServiceCard
          key={addOnService.id}
          addOnService={addOnService}
          styles={styles}
          handleDeleteAddOnService={handleDeleteAddOnService}
          setEditingAddOnId={setEditingAddOnId}
        />
      ))}
    </div>
  );
}

export default AddOnServiceList;
