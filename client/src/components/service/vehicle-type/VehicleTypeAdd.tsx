import { IService, IVehicleType } from "@/types";
import React from "react";

interface IVehicleTypeAdd {
  selectedVehicleType?: IVehicleType | null;
}

function VehicleTypeAdd({
  selectedVehicleType,
}: IVehicleTypeAdd) {
  return (
    <React.Fragment>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control border-primary"
          name="name"
          id="name"
          placeholder="Name"
          defaultValue={selectedVehicleType ? selectedVehicleType.name : ""}
          required={!selectedVehicleType ? true : false}
        />
      </div>
    </React.Fragment>
  );
}

export default VehicleTypeAdd;
