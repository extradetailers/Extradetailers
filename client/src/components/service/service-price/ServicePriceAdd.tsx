import {  IService, IServicePrice, IVehicleType } from "@/types";
import React from "react";

interface IServicePriceAdd {
  allServices: IService[];
  allVehicleTypes: IVehicleType[];
  selectedServicePrice?: IServicePrice | null;
}

function ServicePriceAdd({
  selectedServicePrice,
  allVehicleTypes,
  allServices
}: IServicePriceAdd) {
  return (
    <React.Fragment>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Price
        </label>
        <input
          type="number"
          className="form-control border-primary"
          name="price"
          id="price"
          placeholder="Price"
          defaultValue={selectedServicePrice ? selectedServicePrice.price : ""}
          required={!selectedServicePrice ? true : false}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="service" className="form-label">
          Service
        </label>
        <select
          name="service"
          id="service"
          className="form-control border-primary"
          {...(selectedServicePrice? {value: selectedServicePrice.service} : {})}
          required={!selectedServicePrice ? true : false}
        >
          <option value="">Select a service</option>
          {allServices && allServices.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="vehicle_type" className="form-label">
          Vehicle Type
        </label>
        <select
          name="vehicle_type"
          id="vehicle_type"
          className="form-control border-primary"
          {...(selectedServicePrice? {value: selectedServicePrice.vehicle_type} : {})}
          required={!selectedServicePrice ? true : false}
        >
          <option value="">Select a vehicle type</option>
          {allVehicleTypes && allVehicleTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

    </React.Fragment>
  );
}

export default ServicePriceAdd;
