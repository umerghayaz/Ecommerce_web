import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Alert } from 'antd';
// create User
export const getMyCoupon = createAsyncThunk("getMyCoupon", async (data) => {
    
  try {
    const token = localStorage.getItem("token");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get("http://localhost:5000/api/coupons",
      config
    );
  console.log(response.data,'data');
  return response.data;
} catch (error) {
  return isRejectedWithValue(error.response);
}
});
export const removeFromCart = createAsyncThunk("removeFromCart", async (data) => {
    
  try {
    const token = localStorage.getItem("token");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios.delete(`http://localhost:5000/api/cart`, {
      data: { data },config
    },);
    return data;

} catch (error) {
  return isRejectedWithValue(error.response);
}
});
// read User
export const updateQuantity = createAsyncThunk("updateQuantity", async (data) => {
  console.log('DATA',data)
  const {id,quantity}= data
  console.log('id',id,quantity)
  try {
    const token = localStorage.getItem("token");
    let config = {headers: { Authorization: `Bearer ${token}` },};
    const res = await axios.put(`http://localhost:5000/api/cart/${id}`,
      {
        quantity,
      },
      config
    );
    console.log('hellllllll', id,quantity)
    return {id,quantity}
  } catch (error) {
    return isRejectedWithValue(error.response);
  }
});
export const applyCoupon  = createAsyncThunk("applyCoupon ", async (data) => {
  try {
    const token = localStorage.getItem("token");
    let config = {headers: { Authorization: `Bearer ${token}` },};
    await axios.put(
      `http://localhost:5000/api/cart/${data}`,
      {
        data,
      },
      config
    );
  } catch (error) {
    return isRejectedWithValue(error.response);
  }
});
export const getCartItems = createAsyncThunk("getCartItems", async (data) => {
    
  try {
    const token = localStorage.getItem("token");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get("http://localhost:5000/api/cart",
      config
    );
  console.log(response.data,'data');
  return response.data;
} catch (error) {
  return isRejectedWithValue(error.response);
}
});
export const addToCart = createAsyncThunk("addToCart", async (data) => {
    
  try {
    console.log('products,,data.product._id',data._id)
    const token = localStorage.getItem("token");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const id ={
      id:data._id
    }
    const response = await axios.post("http://localhost:5000/api/cart",
      {
        productId: data._id,
      },
      config
    );
  console.log(response.data,'data');
  return response.data;
} catch (error) {
  return isRejectedWithValue(error.response);
}
});


