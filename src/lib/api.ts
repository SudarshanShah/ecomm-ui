import type { Product } from "@/types/Product";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export async function addProduct(product: Product, token: string) {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!res.ok) {
    throw new Error(`Failed to add product: ${res.statusText}`);
  }

  return res.json();
}

export async function getProducts() {
  const response = await axios.get(`${API_BASE}/products`);
  return response.data;
}

export async function getProduct(id: number) {
  const response = await axios.get(`${API_BASE}/products/${id}`);
  return response.data;
}