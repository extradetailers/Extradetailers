type TModuleStyle = { readonly [key: string]: string };

interface IDefaultModel {
  id?: number;
}

// Service Interfaces
interface IServiceCategory extends IDefaultModel {
  name: string;
}

interface IServiceCommon extends IDefaultModel {
  title: string;
  description: string;
  estimated_time_min: number;
  estimated_time_max: number;
}

interface IService extends IServiceCommon {
  category: number; // Relationship to Category model
  features: number[];
  prices: number[];
}

interface IServicePopulated extends IServiceCommon {
  category: IServiceCategory; // Relationship to Category model
  features: IServiceFeature[];
  prices: IServicePrice[];
}

interface IAddOnService extends IDefaultModel {
  name: string;
  description: string;
  price_min: string;
  price_max: string;
  category: number;
}

interface IAddOnServicePopulated extends IDefaultModel {
  name: string;
  description: string;
  price_min: string;
  price_max: string;
  category: IServiceCategory;
}

interface IServiceFeature extends IDefaultModel {
  service: number;
  feature_description: string;
}

interface IVehicleType extends IDefaultModel {
  name: string;
}

interface IServicePrice extends IDefaultModel {
  service: number;
  vehicle_type: number;
  price: number;
}

// Booking Interface



interface IAPIError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
}

interface IUser extends IDefaultModel {
  email: string;
  first_name: string;
  last_name: string;
  role: EUserRole;
  is_validated: boolean;
  is_admin: boolean;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  username: string;
  date_joined: string;
  last_login: string | null;
  groups: number[];
  user_permissions: number[];
}

/*
interface IUser{
    accessToken: string;
    userRole: string;
}

*/

interface IAuthUser {
  accessToken: string;
  userRole: EUserRole;
}


interface IBookingCommon extends IDefaultModel{
  booking_date: string;
  slot: string;
  status?: EBookingStatus;
}



interface IBooking extends IBookingCommon {
  customer?: number;
  detailer?: number;
  service: number;
  service_details?: IService;

  // New fields
  service_price: number | null;
  vehicle_type: number | null;
  addons: number[];
  // location: number | null;
}

interface IBookingPopulated extends IBookingCommon {
  customer: IUser;
  detailer?: IUser;
  service: IService;

  // New fields
  service_price: IServicePrice;
  vehicle_type: IVehicleType;
  addons: IAddOnService[];
}


interface IMenuItem {
  title: string;
  path: string;
  children?: IMenuItem[]; // recursive for submenus
}

interface IMessage {
  error: boolean;
  text: string;
}

interface IPaymentIntentResponse {
  client_secret: string;
}

//   Enum
export enum EUserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  DETAILER = "detailer",
}

export enum EBookingStatus {
  INITIALIZED = "initialized",
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

export type {
  TModuleStyle,
  IService,
  IAddOnService,
  IServiceCategory,
  IServiceFeature,
  IVehicleType,
  IServicePrice,
  IServicePopulated,
  IAddOnServicePopulated,
  IBooking,
  IBookingPopulated,
  IAPIError,
  IMessage,
  IUser,
  IMenuItem,
  IPaymentIntentResponse,
  IAuthUser,
};
