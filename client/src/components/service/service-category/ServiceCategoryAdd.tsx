import {  IServiceCategory } from "@/types";
import React from "react";

interface IServiceCategoryAdd {
  selectedServiceCategory?: IServiceCategory | null;
}

function ServiceCategoryAdd({
  selectedServiceCategory,
}: IServiceCategoryAdd) {
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
          defaultValue={selectedServiceCategory ? selectedServiceCategory.name : ""}
          required={!selectedServiceCategory ? true : false}
        />
      </div>
    </React.Fragment>
  );
}

export default ServiceCategoryAdd;
