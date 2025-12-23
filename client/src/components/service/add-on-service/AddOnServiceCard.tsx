import { IAddOnService, TModuleStyle } from "@/types";
import React from "react";

interface IAddOnServiceCardProps {
  addOnService: IAddOnService;
  styles: TModuleStyle;
  handleDeleteAddOnService: (
    e: React.SyntheticEvent,
    addOnServiceId: number
  ) => void;
  setEditingAddOnId: (e: React.SyntheticEvent, addOnServiceId: number) => void;
}

function AddOnServiceCard({
  addOnService,
  styles,
  handleDeleteAddOnService,
  setEditingAddOnId,
}: IAddOnServiceCardProps) {

  // Delete addOnService need to work properly with mutation
  // Create a next.js provider to handle error/display error in both server component and client component. Is it possible?
  // Error handling - https://nextjs.org/docs/app/building-your-application/routing/error-handling

  return (
    <div
      className={`card ${styles.addOnServiceCard}`}
      key={addOnService.id}
    >
      <h5 className="card-header">{addOnService.name}</h5>
      <div className="card-body">
        <h5 className="card-title">{addOnService.name}</h5>
        <p className="card-text">{addOnService.description}</p>
        {addOnService.id && (
          <>
            <button
              className="btn btn-primary me-2"
              onClick={(e) => setEditingAddOnId(e, addOnService.id!)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={(e) => handleDeleteAddOnService(e, addOnService.id!)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AddOnServiceCard;
