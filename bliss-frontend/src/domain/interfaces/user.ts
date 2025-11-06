export interface Address {
  houseNo?: string;
  areaName?: string;
  landmark?: string;
  postOffice?: string;
  state?: string;
  pin?: string;
}

export interface User {
  id?: string;
  clerkId: string;
  name: string;
  email: string;
  phone?: string;
  coins: number;
  userVerified: boolean;
  address?: Address;
}


