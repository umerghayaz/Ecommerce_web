import { createSlice } from "@reduxjs/toolkit";
import { createProduct,deleteProduct,fetchAllProducts,fetchFeaturedProducts,fetchProductsByCategory,toggleFeaturedProduct } from "../actions/productAction";

const productSlice = createSlice({
  name: "user",
  initialState: {
    products: [],
    loading: false,
    error: "",
  },
  reducers: {
    // Define your reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        console.log('hello',action.payload)
        state.loading = false;
        state.products = [...state.products,action.payload]
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchAllProducts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        console.log('action.payload',action.payload.products)
        state.products = action.payload.products;
        state.loading = false;

      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true; // Start the refresh process
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        if (Array.isArray(state.products)) {

          state.products = state.products.filter(
              (product) => product._id !== action.payload
          );
      } else {
          console.error("state.products is not an array:", state.products.products[0]);
      }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.products = null; 
        state.loading = false;
      })
     
       // toggleFeaturedProduct
    builder.addCase(toggleFeaturedProduct.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(toggleFeaturedProduct.fulfilled, (state, action) => {
      console.log('productshelo',action.payload)
      const { _id, isFeatured } = action.payload;
      console.log('productid',_id, isFeatured)
      state.products = state.products.map((product) =>
        product._id === _id ? { ...product, isFeatured } : product
      );
            state.loading = false;
    })
    builder.addCase(toggleFeaturedProduct.rejected, (state) => {
      state.products = null;
      state.loading = false;
    })
    builder.addCase(fetchFeaturedProducts.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
      state.products = action.payload;
      state.loading = false;
    })
    builder.addCase(fetchFeaturedProducts.rejected, (state) => {
      state.products = [];
      state.loading = false;
    })
  },
});

export default productSlice.reducer;
