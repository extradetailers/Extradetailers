import { IAddOnService, IServiceCategory } from "@/types";
import React from "react";

interface IAddOnServiceAdd {
  allServiceCategories: IServiceCategory[];
  selectedAddOnService?: IAddOnService | null;
}

function AddOnServiceAdd({
  allServiceCategories,
  selectedAddOnService,
}: IAddOnServiceAdd) {
  
  
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
          defaultValue={selectedAddOnService ? selectedAddOnService.name : ""}
          required={!selectedAddOnService ? true : false}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          className="form-control border-primary"
          rows={2}
          defaultValue={
            selectedAddOnService ? selectedAddOnService.description : ""
          }
          required={!selectedAddOnService ? true : false}
        ></textarea>
      </div>

      <div className="row mb-3">
        <div className="col-md-4 mb-3">
          <label htmlFor="price_min" className="form-label">
            Min Price
          </label>
          <input
            type="number"
            className="form-control border-primary"
            name="price_min"
            id="price_min"
            placeholder="Min Price"
            defaultValue={
              selectedAddOnService ? selectedAddOnService.price_min : ""
            }
            required={!selectedAddOnService ? true : false}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="price_max" className="form-label">
            Max Price
          </label>
          <input
            type="number"
            className="form-control border-primary"
            name="price_max"
            id="price_max"
            placeholder="Max Price"
            defaultValue={
              selectedAddOnService ? selectedAddOnService.price_max : ""
            }
            required={!selectedAddOnService ? true : false}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="category" className="form-label">
            Service Category
          </label>
          <select
            name="category"
            id="category"
            className="form-control border-primary"
            {...(selectedAddOnService? {value: selectedAddOnService.category} : {})}
            required={!selectedAddOnService ? true : false}
          >
            <option value="">Select a category</option>
            {allServiceCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </React.Fragment>
  );
}

export default AddOnServiceAdd;
