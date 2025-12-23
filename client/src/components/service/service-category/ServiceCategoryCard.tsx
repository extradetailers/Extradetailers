import { IServiceCategory, TModuleStyle } from "@/types";
import React from "react";

interface IServiceCategoryCardProps {
  serviceCategory: IServiceCategory;
  styles: TModuleStyle;
  handleDeleteServiceCategory: (
    e: React.SyntheticEvent,
    serviceCategoryId: number
  ) => void;
  setEditingAddOnId: (
    e: React.SyntheticEvent,
    serviceCategoryId: number
  ) => void;
}

function ServiceCategoryCard({
  serviceCategory,
  styles,
  handleDeleteServiceCategory,
  setEditingAddOnId,
}: IServiceCategoryCardProps) {
  // Delete serviceCategory need to work properly with mutation
  // Create a next.js provider to handle error/display error in both server component and client component. Is it possible?
  // Error handling - https://nextjs.org/docs/app/building-your-application/routing/error-handling

  return (
    <div
      className={`card ${styles.serviceCategoryCard}`}
      key={serviceCategory.id}
    >
      <div className="card-body">
        <p className="card-text">{serviceCategory.name}</p>
        {serviceCategory?.id && (
          <>
            <button
              className="btn btn-primary me-2"
              onClick={(e) => setEditingAddOnId(e, serviceCategory.id!)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={(e) => handleDeleteServiceCategory(e, serviceCategory.id!)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ServiceCategoryCard;
