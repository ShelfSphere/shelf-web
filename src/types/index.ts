export type UserRole = "SUPERMARKET" | "PRODUCT_OWNER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type ShelfTier = "BOTTOM" | "MIDDLE" | "EYE_LEVEL" | "TOP";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Supermarket {
  id: string;
  name: string;
  address: string;
  userId: string;
  halls: Hall[];
  createdAt: string;
}

export interface Hall {
  id: string;
  name: string;
  supermarketId: string;
  width: number;
  depth: number;
  height: number;
  shelves: Shelf[];
}

export interface Shelf {
  id: string;
  hallId: string;
  name: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  width: number;
  depth: number;
  height: number;
  tier: ShelfTier;
  levels: number;
  pricePerDay: number;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  shelfId: string;
  shelf: Shelf;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}
