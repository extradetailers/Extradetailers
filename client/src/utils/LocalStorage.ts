import { EUserRole, IAuthUser, IBooking, IUser } from "@/types";

class LocalStorage {
  private static instance: LocalStorage;
  private readonly ORDER: string;
  private readonly ACCESS_TOKEN: string;
  private readonly USER_ROLE: string;

  private constructor() {
    this.ORDER = "booking_list";
    this.ACCESS_TOKEN = "access_token";
    this.USER_ROLE = "user_role";
  }

  static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }

  getBookings(): IBooking[] {
    const oi = localStorage.getItem(this.ORDER);
    const bookingList: IBooking[] = oi ? JSON.parse(oi) : [];
    return bookingList;
  }

  clearBookings() {
    localStorage.removeItem(this.ORDER);
    // Dispatch custom event
    window.dispatchEvent(new Event("clear-bookings"));
  }

  addBooking(booking: IBooking) {
    const prevBookings = this.getBookings();
    const findPrevIndex = prevBookings.findIndex(
      (o) =>
        o.service === booking.service &&
        o.booking_date === booking.booking_date &&
        o.slot === booking.slot
    );
    if (findPrevIndex !== -1) {
      // Update booking
      prevBookings[findPrevIndex] = {
        ...prevBookings[findPrevIndex],
        ...booking,
        id: prevBookings[findPrevIndex].id,
      };
    } else {
      prevBookings.push({ ...booking, id: prevBookings.length + 1 });
    }
    localStorage.setItem(this.ORDER, JSON.stringify(prevBookings));
    window.dispatchEvent(new Event("add-booking"));
  }

  updateBooking(filter: Partial<IBooking>, update: Partial<IBooking>) {
    const prevBookings = this.getBookings();
  
    const findPrevIndex = prevBookings.findIndex((prev) =>
      Object.entries(filter).every(
        ([key, value]) => value !== undefined && prev[key as keyof IBooking] === value
      )
    );
  
    if (findPrevIndex !== -1) {
      prevBookings[findPrevIndex] = {
        ...prevBookings[findPrevIndex],
        ...update,
        id: prevBookings[findPrevIndex]?.id, // Keep original ID
      };
  
      localStorage.setItem(this.ORDER, JSON.stringify(prevBookings));
      window.dispatchEvent(new Event("update-booking"));
    }
  }
  

  removeBooking(serviceId: number, bookingDate: string, slot: string) {
    const prevBookings = this.getBookings();
    const newBookings = prevBookings.filter(
      (o) =>
        o.service !== serviceId &&
        o.booking_date !== bookingDate &&
        o.slot !== slot
    );
    localStorage.setItem(this.ORDER, JSON.stringify(newBookings));
    window.dispatchEvent(new Event("remove-booking"));
  }

  setUser(accessToken: string, userRole: EUserRole): void {
    if (!accessToken || !userRole) return;
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
    localStorage.setItem(this.USER_ROLE, userRole);
  }

  getUser(): IAuthUser | null {
    const accessToken = localStorage.getItem(this.ACCESS_TOKEN);
    const userRole = localStorage.getItem(this.USER_ROLE) as EUserRole | null;

    return accessToken && userRole ? { accessToken, userRole } : null;
  }

  removeUser(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.USER_ROLE);
  }
}

export default LocalStorage.getInstance();
