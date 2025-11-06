"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RentalItem, CartItem, RentalFilter, RentalBooking } from "@/lib/types/rental";

interface RentalState {
  cart: CartItem[];
  filter: RentalFilter;
  selectedDate: string | null;
  addToCart: (item: RentalItem, quantity: number, date: string, duration: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  updateFilter: (filter: Partial<RentalFilter>) => void;
  setSelectedDate: (date: string | null) => void;
}

export const useRentalStore = create<RentalState>()(
  persist(
    (set) => ({
      cart: [],
      filter: {
        categories: [],
        priceRange: { min: 0, max: 100000 },
        sortBy: "rating"
      },
      selectedDate: null,

      addToCart: (item, quantity, date, duration) =>
        set((state) => {
          const existingItem = state.cart.find((cartItem) => cartItem.itemId === item.id);
          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem.itemId === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + quantity }
                  : cartItem
              ),
            };
          }
          return {
            cart: [
              ...state.cart,
              { itemId: item.id, quantity, selectedDate: date, duration, item },
            ],
          };
        }),

      removeFromCart: (itemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.itemId !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.itemId === itemId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ cart: [] }),

      updateFilter: (filter) =>
        set((state) => ({
          filter: { ...state.filter, ...filter },
        })),

      setSelectedDate: (date) => set({ selectedDate: date }),
    }),
    {
      name: "rental-store",
      partialize: (state) => ({
        cart: state.cart,
        selectedDate: state.selectedDate,
      }),
    }
  )
);
