import { IService, IServicePrice, TModuleStyle } from "@/types";
import React from "react";

interface IServicePriceCardProps {
  service: IService;
  servicePrice: IServicePrice;
  styles: TModuleStyle;
  handleDeleteServicePrice: (
    e: React.SyntheticEvent,
    servicePriceId: number
  ) => void;
  setEditingAddOnId: (
    e: React.SyntheticEvent,
    servicePriceId: number
  ) => void;
}

function ServicePriceCard({
  service,
  servicePrice,
  styles,
  handleDeleteServicePrice,
  setEditingAddOnId,
}: IServicePriceCardProps) {
  // Delete servicePrice need to work properly with mutation
  // Create a next.js provider to handle error/display error in both server component and client component. Is it possible?
  // Error handling - https://nextjs.org/docs/app/building-your-application/routing/error-handling

  return (
    <div
      className={`card ${styles.servicePriceCard}`}
      key={servicePrice.id}
    >
      <div className="card-body">
      <h5 className="card-title">${servicePrice.price}</h5>
        <p className="card-text">{service.title}</p>
        {servicePrice?.id && (
          <>
            <button
              className="btn btn-primary me-2"
              onClick={(e) => setEditingAddOnId(e, servicePrice.id!)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={(e) => handleDeleteServicePrice(e, servicePrice.id!)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ServicePriceCard;
