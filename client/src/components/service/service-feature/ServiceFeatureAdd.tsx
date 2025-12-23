import { IService, IServiceFeature } from "@/types";
import React from "react";

interface IServiceFeatureAdd {
  allServices: IService[];
  selectedFeatureService?: IServiceFeature | null;
}

function ServiceFeatureAdd({
  allServices,
  selectedFeatureService,
}: IServiceFeatureAdd) {
  return (
    <React.Fragment>
      <div className="mb-3">
        <label htmlFor="feature_description" className="form-label">
          Description
        </label>
        <textarea
          name="feature_description"
          id="feature_description"
          className="form-control border-primary"
          rows={2}
          defaultValue={
            selectedFeatureService ? selectedFeatureService.feature_description : ""
          }
          required={!selectedFeatureService ? true : false}
        ></textarea>
      </div>

      <div className="mb-3">
        <label htmlFor="service" className="form-label">
          Service
        </label>
        <select
          name="service"
          id="service"
          className="form-control border-primary"
          {...(selectedFeatureService? {value: selectedFeatureService.service} : {})}
          required={!selectedFeatureService ? true : false}
        >
          <option value="">Select a service</option>
          {allServices.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>
    </React.Fragment>
  );
}

export default ServiceFeatureAdd;
