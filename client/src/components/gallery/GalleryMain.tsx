import { TModuleStyle } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Updated gallery items with Picsum images
const galleryItems = [
  {
    id: 100,
    imageUrl:
      "https://images.pexels.com/photos/3806261/pexels-photo-3806261.jpeg",
    title: "Professional Car Wash",
    category: "Exterior",
    cols: 2,
    aspect: "Landscape",
  },
  {
    id: 101,
    imageUrl:
      "https://images.pexels.com/photos/3806270/pexels-photo-3806270.jpeg",
    title: "Interior Vacuuming",
    category: "Interior",
    cols: 1,
    aspect: "Portrait",
  },
  {
    id: 102,
    imageUrl:
      "https://images.pexels.com/photos/3806271/pexels-photo-3806271.jpeg",
    title: "Tire Cleaning",
    category: "Wheels",
    cols: 1,
    aspect: "Square",
  },
  {
    id: 103,
    imageUrl:
      "https://images.pexels.com/photos/3806272/pexels-photo-3806272.jpeg",
    title: "Foam Wash Application",
    category: "Exterior",
    cols: 2,
    aspect: "Panoramic",
  },
  {
    id: 104,
    imageUrl:
      "https://images.pexels.com/photos/3806273/pexels-photo-3806273.jpeg",
    title: "Dashboard Detailing",
    category: "Interior",
    cols: 1,
    aspect: "Portrait",
  },
  {
    id: 105,
    imageUrl:
      "https://images.pexels.com/photos/3806274/pexels-photo-3806274.jpeg",
    title: "Engine Bay Cleaning",
    category: "Engine",
    cols: 1,
    aspect: "Landscape",
  },
  {
    id: 106,
    imageUrl:
      "https://images.pexels.com/photos/3806275/pexels-photo-3806275.jpeg",
    title: "Polishing Exterior",
    category: "Exterior",
    cols: 2,
    aspect: "Landscape",
  },
  {
    id: 107,
    imageUrl:
      "https://images.pexels.com/photos/3806276/pexels-photo-3806276.jpeg",
    title: "Seat Shampooing",
    category: "Interior",
    cols: 1,
    aspect: "Portrait",
  },
  {
    id: 108,
    imageUrl:
      "https://images.pexels.com/photos/3806277/pexels-photo-3806277.jpeg",
    title: "Drying the Car",
    category: "Exterior",
    cols: 1,
    aspect: "Landscape",
  },
  {
    id: 109,
    imageUrl:
      "https://images.pexels.com/photos/3806278/pexels-photo-3806278.jpeg",
    title: "Waxing Finish",
    category: "Exterior",
    cols: 1,
    aspect: "Square",
  },
];

function GalleryMain({ styles }: { styles: TModuleStyle }) {
  const aspectRatio = (name: string) => `aspectRatio${name}`;

  return (
    <div className="container py-4">
      {/* Hero Section */}
      <div className="row align-items-center mb-4">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <h1 className="display-5 fw-bold">Shine Your Ride</h1>
          <p className="text-muted lead mb-3">
            Experience professional car cleaning and detailing services designed
            to make your vehicle look brand new.
          </p>
          <div className="d-flex gap-2 flex-wrap">
            <Link href="/packages" className="btn btn-primary px-4 py-2">
              Book Now
            </Link>
            <Link href="/about-us" className="btn btn-outline-secondary px-4 py-2">
              Why Choose Us?
            </Link>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm">
            <img
              src="https://images.pexels.com/photos/3806261/pexels-photo-3806261.jpeg"
              alt="Car being cleaned"
              className="w-100 h-100 object-fit-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div
        className="sticky-top bg-white py-3 border-bottom mb-3"
        style={{ zIndex: 1020 }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <h2 className="h5 mb-0">Browse Services</h2>
          <div className={`${styles.btnGroup} btn-group-sm`} role="group">
            {[
              "All",
              "Exterior",
              "Interior",
              "Wheels",
              "Engine",
              "Waxing",
              "Vacuuming",
              "Polishing",
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                className="btn btn-outline-dark rounded-pill mx-1"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {galleryItems.map((item) => (
          <div key={item.id} className="col">
            <div className={`card border-0 shadow-sm ${styles.galleryItem}`}>
              <div
                className={`position-relative ${
                  styles[aspectRatio(item.aspect)]
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-100 h-100 object-fit-cover"
                  loading="lazy"
                />
                <div
                  className={`${styles.galleryOverlay} position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-3`}
                >
                  <span className="badge bg-primary mb-1">{item.category}</span>
                  <h6 className="text-white mb-1">{item.title}</h6>
                  <button className="btn btn-sm btn-light rounded-pill mt-1">
                    View <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-4">
        <button className="btn btn-outline-primary rounded-pill px-4 py-2">
          Load More
          <span
            className="spinner-border spinner-border-sm ms-2 d-none"
            aria-hidden="true"
          ></span>
        </button>
      </div>
    </div>
  );
}

export default GalleryMain;
