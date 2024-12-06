import { createSlice } from "@reduxjs/toolkit";
import { createProduct,deleteProduct,fetchAllProducts,fetchFeaturedProducts,fetchProductsByCategory,toggleFeaturedProduct } from "../actions/productAction";
import {removeFromCart,updateQuantity,getCartItems,addToCart} from "../actions/cartAction";
import { toast } from "react-hot-toast";
const productSlice = createSlice({
  name: "user",
  initialState: {
    products: [],
    loading: false,
    error: "",
    cart: [],

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
    builder.addCase(fetchProductsByCategory.pending, (state) => {
      state.loading = true;
      state.error = null;    })
    builder.addCase(fetchProductsByCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    })
    builder.addCase(fetchProductsByCategory.rejected, (state,action) => {
      state.loading = false;
        state.error = action.payload;
    })
    builder.addCase(getCartItems.fulfilled, (state, action) => {
      state.cart = action.payload;
    })
    builder.addCase(getCartItems.rejected, (state, action) => {
      state.cart = action.payload;
    })
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter((item) => item._id !== productId)})
      builder.addCase(removeFromCart.rejected, (state, action) => {
      state.loading = true;
       })
       builder.addCase(updateQuantity.pending, (state) => {
        state.loading = true;
      })
      builder.addCase(updateQuantity.fulfilled, (state, action) => {
        console.log('actionin upadate',action.payload)
        // const { _id, quantity } = action.payload[0];
        console.log('hhhhhhhhhhhhhhhhhh')
        console.log('id,quantity',action.payload.id,action.payload.quantity)
        // console.log('id,quantity',_id,quantity)

        if (action?.payload.quantity === 0) {
          state.cart = state.cart.filter((item) => item.id !== action.payload.id);
          // calculateTotals(state)
        } else {
          console.log('inside else',state.cart)
          const item = state.cart.filter((item) => JSON.parse(item._id == action.payload.id));
          // let hello = JSON.parse(JSON.stringify(item));
          // const item = state.cart.find((item) => item._id === action.payload[0]._id);
          console.log('itemeeeeeeeeee',item,state.cart)
          item.forEach((item1) => {
            console.log(item1.quantity);
            if (item1) item1.quantity = action.payload.quantity;
            // Logs 'quantity' for each proxied item
          },
          
        );

         
        }
        
        state.loading = false
      })
      builder.addCase(updateQuantity.rejected, (state) => {
        state.cart = null;
        state.loading = false;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        console.log('inside acyion addto cart',action.payload)
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error(action.payload);
      })
  
  },
});

export default productSlice.reducer;
