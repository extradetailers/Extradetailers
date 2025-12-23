import { IService, IVehicleType, TModuleStyle } from "@/types";
import React from "react";

interface IVehicleTypeCardProps {
  vehicleType: IVehicleType;
  styles: TModuleStyle;
  handleDeleteVehicleType: (
    e: React.SyntheticEvent,
    vehicleTypeId: number
  ) => void;
  setEditingAddOnId: (
    e: React.SyntheticEvent,
    vehicleTypeId: number
  ) => void;
}

function VehicleTypeCard({
  vehicleType,
  styles,
  handleDeleteVehicleType,
  setEditingAddOnId,
}: IVehicleTypeCardProps) {
  // Delete vehicleType need to work properly with mutation
  // Create a next.js provider to handle error/display error in both server component and client component. Is it possible?
  // Error handling - https://nextjs.org/docs/app/building-your-application/routing/error-handling

  return (
    <div
      className={`card ${styles.vehicleTypeCard}`}
      key={vehicleType.id}
    >
      <div className="card-body">
        <p className="card-text">{vehicleType.name}</p>
        {vehicleType?.id && (
          <>
            <button
              className="btn btn-primary me-2"
              onClick={(e) => setEditingAddOnId(e, vehicleType.id!)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={(e) => handleDeleteVehicleType(e, vehicleType.id!)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VehicleTypeCard;
