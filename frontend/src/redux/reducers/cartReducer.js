import { applyCoupon,getMyCoupon,removeFromCart,updateQuantity,getCartItems,addToCart } from "../actions/cartAction";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,
    status: "idle", // For loading states
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = [];
      state.coupon = null;
      state.total = 0;
      state.subtotal = 0;
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.isCouponApplied = false;
      toast.success("Coupon removed");
    },
  
    
    calculateTotals: (state) => {
    //   console.log('fffffffffffffffff',state.cart)
    //   const fff=state.cart.reduce(
    //     (sum, item) => sum + item.price * item.quantity
    //   )
    //   console.log('dddddddddd',fff)
    //   state.subtotal = state.cart.reduce(
    //     (sum, item) => sum + item.price * item.quantity
    //   );
    //   if (state.coupon) {
    //     const discount = state.subtotal * (state.coupon.discountPercentage / 100);
    //     state.total = state.subtotal - discount;
    //   } else {
    //     state.total = state.subtotal;
    //   }
    // },'
    console.log('inside total');
    
    if (!Array.isArray(state.cart)) {
      console.error('Cart is not an array:', state.cart);
      state.cart = []; // Default to an empty array
    }
    
    const fff = state.cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
    console.log('Subtotal:', fff);
    
    state.subtotal = state.cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
    
    if (state.coupon && typeof state.coupon.discountPercentage === 'number') {
      const discount = state.subtotal * (state.coupon.discountPercentage / 100);
      state.total = state.subtotal - discount;
    } else {
     } state.total = state.subtotal;
    }
    
  },
  extraReducers: (builder) => {
    builder.addCase(getMyCoupon.fulfilled, (state, action) => {
        state.coupon = action.payload;
      })
      builder.addCase(applyCoupon.fulfilled, (state, action) => {
        state.coupon = action.payload;
        state.isCouponApplied = true;
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
            calculateTotals(state)
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

            // state.products = state.products.map((product) =>
            //   product._id === _id ? { ...product, isFeatured } : product
            // );
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
          const newarray = action.payload
          const product = action.payload;
          const existingItem = product.filter(productItem =>
            state.cart.some(cartItem => cartItem._id === productItem._id)
          );
          const uniqueToArray1 = newarray.filter(
            item1 => !state.cart.some(item2 => item1._id === item2._id)
          );
          console.log('lengthrrrrrrrrrrrr',existingItem.length,uniqueToArray1.length)
          console.log('length',existingItem,uniqueToArray1)

          if (state.cart.length ===0){
            state.cart.push( {newarray})   
              }
        //  else if (existingItem.length !== 0) {
        //     // existingItem[0].quantity += 1;
        //     console.log('length',existingItem,)

        //   }
          else if (uniqueToArray1.length !==0) {
            console.log('frrrrrrrrrrr')
            const uniqueToArray1 = newarray.filter(
              item1 => !state.cart.some(item2 => item1._id === item2._id)
            );
            state.cart = [{...state.cart, ...uniqueToArray1}]

            console.log('uniqueToArray1',uniqueToArray1)

                    } else {
            // console.log('after else')

            // const uniqueToArray1 = newarray.filter(
            //   item1 => !state.cart.some(item2 => item1._id === item2._id)
            // );
            // console.log('uniqueToArray1',uniqueToArray1)

            // state.cart.push({ ...product,uniqueToArray1});
          }
  
          state.status = "idle";
          toast.success("Product added to cart");
  
          // Recalculate totals after updating the cart
    
        })
        .addCase(addToCart.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
          toast.error(action.payload);
        })
    

     
  },
});

export const {
  clearCart,
  // addToCart,
  calculateTotals,
  removeCoupon
} = cartSlice.actions;

export default cartSlice.reducer;
