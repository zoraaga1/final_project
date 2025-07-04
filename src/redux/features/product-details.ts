import { createSlice } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const initialState = {
  value: {
    _id: "",
    title: "",
    price: 0,
    discountedPrice: 0,
    description: "",
    category: "",
    imgs: [],
    createdBy: {
      _id: "",
      name: "",
      email: "",
      rating: 0,
    },
    reviews: 0,
  },
} as InitialState;

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateproductDetails: (_, action) => {
      return {
        value: {
          ...action.payload,
        },
      };
    },
  },
});

export const { updateproductDetails } = productDetails.actions;
export default productDetails.reducer;