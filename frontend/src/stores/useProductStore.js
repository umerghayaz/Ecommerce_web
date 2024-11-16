import { create } from "zustand";
import toast from "react-hot-toast";
// import axios from "../lib/axios";
import axios from "axios";
import { config } from "dotenv";
export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      let config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const res = await axios.post(
        "http://localhost:5000/api/products",
        productData,
        config
      );
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    const token = localStorage.getItem("token");
    let config = {
            headers: { Authorization: `Bearer ${token}` },
          };
    set({ loading: true });
    try {
      const response = await axios.get("http://localhost:5000/api/products",config);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      let config = {
              headers: { Authorization: `Bearer ${token}` },
            };
      const response = await axios.get(
        `http://localhost:5000/api/products/category/${category}`,
        config
      );
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      let config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`http://localhost:5000/api/products/${productId}`,config);
      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete product");
    }
  },
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      let config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.patch(
        `http://localhost:5000/api/products/${productId}`,config
      );
      // this will update the isFeatured prop of the product
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to update product");
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      let config = {
              headers: { Authorization: `Bearer ${token}` },
            };
      const response = await axios.get(
        "http://localhost:5000/api/products/featured",config
      );
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.log("Error fetching featured products:", error);
    }
  },
}));
