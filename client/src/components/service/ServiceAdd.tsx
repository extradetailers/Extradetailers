import {
  IService,
  IServiceCategory,
  IServiceFeature,
  IServicePrice,
} from "@/types";
import React from "react";

interface IServiceAddProps {
  serviceCategories: IServiceCategory[];
  serviceFixtures: IServiceFeature[];
  servicePrices: IServicePrice[];
  selectedService?: IService | null;
}

function ServiceAdd({
  selectedService,
  serviceFixtures,
  serviceCategories,
  servicePrices,
}: IServiceAddProps) {
  return (
    <div className="card shadow p-4 rounded-4 border border-light-subtle">
      <h4 className="mb-4 fw-bold text-primary">Add / Edit Service</h4>

      {/* Title */}
      <div className="mb-3">
        <label htmlFor="title" className="form-label fw-semibold">
          Title
        </label>
        <input
          type="text"
          className="form-control border-primary"
          name="title"
          id="title"
          placeholder="Enter service title"
          defaultValue={selectedService?.title || ""}
          required
        />
      </div>

      {/* Category */}
      <div className="mb-3">
        <label htmlFor="category" className="form-label fw-semibold">
          Category
        </label>
        <select
          className="form-select border-primary"
          name="category"
          id="category"
          defaultValue={selectedService?.category || ""}
          required
        >
          <option value="">-- Select Category --</option>
          {serviceCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="mb-3">
        <label htmlFor="description" className="form-label fw-semibold">
          Description
        </label>
        <textarea
          className="form-control border-primary"
          name="description"
          id="description"
          rows={4}
          placeholder="Enter service description"
          defaultValue={selectedService?.description || ""}
          required
        />
      </div>

      {/* Estimated Time Min */}
      <div className="mb-3">
        <label htmlFor="estimated_time_min" className="form-label fw-semibold">
          Estimated Time (Min)
        </label>
        <input
          type="number"
          className="form-control border-primary"
          name="estimated_time_min"
          id="estimated_time_min"
          placeholder="Minimum estimated time in minutes"
          defaultValue={selectedService?.estimated_time_min || ""}
          required
        />
      </div>

      {/* Estimated Time Max */}
      <div className="mb-3">
        <label htmlFor="estimated_time_max" className="form-label fw-semibold">
          Estimated Time (Max)
        </label>
        <input
          type="number"
          className="form-control border-primary"
          name="estimated_time_max"
          id="estimated_time_max"
          placeholder="Maximum estimated time in minutes"
          defaultValue={selectedService?.estimated_time_max || ""}
          required
        />
      </div>

      {/* Prices */}
      <div className="mb-3">
        <label htmlFor="prices" className="form-label fw-semibold">
          Vehicle Type Prices
        </label>
        <select
          multiple
          className="form-select border-primary"
          name="prices"
          id="prices"
          required
        >
          {servicePrices.map((price) => (
            <option key={price.id} value={price.id}>
              {/* {price.vehicle_type.name} - ${price.price} */}
              Truck - $20
            </option>
          ))}
        </select>
        <div className="form-text">
          Hold Ctrl (Windows) or Command (Mac) to select multiple.
        </div>
      </div>

      {/* Features */}
      <div className="mb-3">
        <label htmlFor="features" className="form-label fw-semibold">
          Features
        </label>
        <select
          multiple
          className="form-select border-primary"
          name="features"
          id="features"
          required
        >
          {serviceFixtures.map((feature) => (
            <option key={feature.id} value={feature.id}>
              {feature.feature_description}
            </option>
          ))}
        </select>
        <div className="form-text">
          Hold Ctrl (Windows) or Command (Mac) to select multiple.
        </div>
      </div>

      {/* Submit Button */}
      <div className="d-grid">
        <button type="submit" className="btn btn-primary fw-semibold">
          {selectedService ? "Update Service" : "Create Service"}
        </button>
      </div>
    </div>
  );
}

export default ServiceAdd;
