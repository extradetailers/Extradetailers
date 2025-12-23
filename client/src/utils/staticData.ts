import { EBookingStatus, IMenuItem } from "@/types";

const adminMenuList: IMenuItem[] = [
  {
    title: "Admin",
    path: "/admin",
  },
  {
    title: "Bookings",
    path: "/admin/booking",
  },
  {
    title: "Services",
    path: "/admin/service",
    children: [
      { title: "All", path: "/admin/service" },
      { title: "Service Category", path: "/admin/service/service-category" },
      { title: "Vehicle Type", path: "/admin/service/vehicle-type" },
      { title: "Service Price", path: "/admin/service/service-price" },
      { title: "Service Feature", path: "/admin/service/service-feature" },
      { title: "Add-On Service", path: "/admin/service/add-on-service" },
    ],
  },
  {
    title: "Customers",
    path: "/admin/customer",
  },
  {
    title: "Users",
    path: "/admin/user",
  },
  {
    title: "Detailers",
    path: "/admin/detailer",
  },
];

const dashboardMenuList: IMenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard"
  },
  {
    title: "Bookings",
    path: "/dashboard/bookings"
  },
  {
    title: "Checkout",
    path: "/dashboard/checkout"
  }
];



  const userBoolFields = [
    "is_validated",
    "is_admin",
    "is_active",
    "is_staff",
    "is_superuser",
  ];


  const bookingStatuses = [EBookingStatus.INITIALIZED, EBookingStatus.PENDING, EBookingStatus.COMPLETED, EBookingStatus.CANCELED];

  export {adminMenuList, userBoolFields, dashboardMenuList, bookingStatuses};