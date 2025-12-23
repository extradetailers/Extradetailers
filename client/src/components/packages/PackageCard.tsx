import React, { useMemo } from "react";
import { MdHistoryToggleOff, MdOutlineDone } from "react-icons/md";
import {
  IService,
  IServicePopulated,
  IVehicleType,
  TModuleStyle,
} from "@/types";

interface IPackageCardProps {
  styles: TModuleStyle;
  service: IServicePopulated;
  vehicleTypeMap: Map<number, IVehicleType>;
  index: number;
  isActive: boolean;
  onToggle: () => void;
  onSelect: (service: IServicePopulated) => void;
}

function PackageCard({
  styles,
  service,
  index,
  vehicleTypeMap,
  isActive,
  onToggle,
  onSelect,
}: IPackageCardProps) {
  


  return (
    <div className="accordion-item border-0 shadow-sm mb-3 rounded-3 overflow-hidden">
      <h3 className="accordion-header" id="headingOne">
        <button
          className="accordion-button collapsed bg-white text-dark fw-bold py-3"
          type="button"
          onClick={onToggle}
          aria-expanded={isActive}
          aria-controls="collapseOne"
        >
          <div className="d-flex align-items-center">
            <span className="badge bg-primary me-3">Basic</span>
            <div>
              <h4 className="mb-0">{service.title}</h4>
              <small className="text-muted">{service.category.name}</small>
            </div>
          </div>
        </button>
      </h3>
      <div
        id="collapseOne"
        className={`accordion-collapse collapse ${isActive ? "show" : ""}`}
        aria-labelledby="headingOne"
        data-bs-parent="#packagesAccordion"
      >
        <div className="accordion-body p-4">
          <div className="row">
            <div className="col-md-8">
              <p className="text-muted mb-4">{service.description}</p>
              <div className="d-flex align-items-center mb-3 gap-2">
                <MdHistoryToggleOff size={20} />
                <span>{service.estimated_time_min < 60
              ? `${service.estimated_time_min} minutes`
              : `${(service.estimated_time_min / 60).toFixed(2)} hours`} - {service.estimated_time_max < 60
                ? `${service.estimated_time_max} minutes`
                : `${(service.estimated_time_max / 60).toFixed(2)} hours`}</span>
              </div>

              <h5 className="fw-bold mb-3">Features</h5>
              <ul className="list-unstyled mb-4">
                {service.features.map((feature) => (
                  <li className="mb-2" key={feature.id}>
                    <MdOutlineDone color="aqua" />
                    {feature.feature_description}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-md-4 border-start">
              <h5 className="fw-bold mb-3">Pricing</h5>
              <ul className="list-group list-group-flush">
                {service.prices.map((price)=>(<li key={price.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {vehicleTypeMap.get(price.vehicle_type)?.name}
                  <span className="badge bg-primary rounded-pill">${price.price}</span>
                </li>))}
                
              </ul>
              <button className="btn btn-primary w-100 mt-3" onClick={() => onSelect(service)}>
                Select Package
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackageCard;
