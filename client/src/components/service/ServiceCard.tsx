import { IService, TModuleStyle } from "@/types";
import React from "react";

interface IServiceCardProps {
  service: IService;
  styles: TModuleStyle;
  handleDeleteService: (
    e: React.SyntheticEvent,
    serviceId: number
  ) => void;
  setEditingServiceId: (
    e: React.SyntheticEvent,
    serviceId: number
  ) => void;
}

function ServiceCard({
  service,
  styles,
  handleDeleteService,
  setEditingServiceId,
}: IServiceCardProps) {
  // Delete service need to work properly with mutation
  // Create a next.js provider to handle error/display error in both server component and client component. Is it possible?
  // Error handling - https://nextjs.org/docs/app/building-your-application/routing/error-handling

  return (
    <div
      className={`card ${styles.serviceCard}`}
      key={service.id}
    >
      <div className="card-body">
        <p className="card-text">{service.title}</p>
        {service?.id && (
          <>
            <button
              className="btn btn-primary me-2"
              onClick={(e) => setEditingServiceId(e, service.id!)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={(e) => handleDeleteService(e, service.id!)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ServiceCard;
