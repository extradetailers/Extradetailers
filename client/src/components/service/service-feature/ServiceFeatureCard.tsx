import { IService, IServiceFeature, TModuleStyle } from "@/types";
import React from "react";

interface IServiceFeatureCardProps {
  serviceFeature: IServiceFeature;
  service: IService | undefined;
  styles: TModuleStyle;
  handleDeleteServiceFeature: (
    e: React.SyntheticEvent,
    serviceFeatureId: number
  ) => void;
  setEditingAddOnId: (
    e: React.SyntheticEvent,
    serviceFeatureId: number
  ) => void;
}

function ServiceFeatureCard({
  serviceFeature,
  service,
  styles,
  handleDeleteServiceFeature,
  setEditingAddOnId,
}: IServiceFeatureCardProps) {
  // Delete serviceFeature need to work properly with mutation
  // Create a next.js provider to handle error/display error in both server component and client component. Is it possible?
  // Error handling - https://nextjs.org/docs/app/building-your-application/routing/error-handling

  return (
    <div
      className={`card ${styles.serviceFeatureCard}`}
      key={serviceFeature.id}
    >
      <div className="card-body">
        <p className="card-text">{serviceFeature.feature_description}</p>
        <p className="card-text">For "{service?.title}"" service</p>
        {serviceFeature?.id && (
          <>
            <button
              className="btn btn-primary me-2"
              onClick={(e) => setEditingAddOnId(e, serviceFeature.id!)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={(e) => handleDeleteServiceFeature(e, serviceFeature.id!)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ServiceFeatureCard;
