import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Alert } from 'antd';
// create User
export const createProduct = createAsyncThunk("createProduct", async (data) => {
    
  try {
    const token = localStorage.getItem("token");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post("http://localhost:5000/api/products",
      data,
      config
    );
  console.log(response.data,'data');
  return response.data;
} catch (error) {
  return isRejectedWithValue(error.response);
}
});
export const deleteProduct = createAsyncThunk("deleteProduct", async (data) => {
    
  try {
    const token = localStorage.getItem("token");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios.delete(`http://localhost:5000/api/products/${data}`,config);
    return data;

} catch (error) {
  return isRejectedWithValue(error.response);
}
});
// read User
export const fetchAllProducts = createAsyncThunk("fetchAllProducts", async (data) => {
  try {
    const token = localStorage.getItem("token");
    let config = {headers: { Authorization: `Bearer ${token}` },};
    const res = await axios.get("http://localhost:5000/api/products",config);

    console.log(res.data);
    return res.data;
  } catch (error) {
    return isRejectedWithValue(error.response);
  }
});
export const toggleFeaturedProduct = createAsyncThunk("toggleFeaturedProduct", async (data) => {
  try {
    const token = localStorage.getItem("token");
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log('data',data)
      
    const res = await axios.get(`http://localhost:5000/api/products/${data}`,config);

    console.log(res.data);
    return res.data; 
  } catch (error) {
    return isRejectedWithValue(error.response);
  }
});
export const fetchFeaturedProducts = createAsyncThunk("fetchFeaturedProducts", async (data) => {
  try {
    const token = localStorage.getItem("token");
    let config = 
    {
      headers: { Authorization: `Bearer ${token}` },
    };
    const res = await axios.get("http://localhost:5000/api/products/featured",config);
    return res.data;
  } catch (error) {
    return isRejectedWithValue(error.response);
  }
});
<<<<<<< HEAD
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(
        `http://localhost:5000/api/products/category/${category}`,
        config
      );
      console.log('productsssssssss',response.data);
      
      return response.data.products; // Payload for the fulfilled case
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch products");
      return rejectWithValue(error.response?.data?.error || "Failed to fetch products");
    }
  }
);
=======

>>>>>>> c423a3b7784c31d9246cef03a52e344550aec046
