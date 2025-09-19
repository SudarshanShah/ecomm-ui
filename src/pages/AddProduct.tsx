import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types/Product";
import { addProduct } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/textarea";

const API_BASE =
  (import.meta.env.VITE_API_URL as string) ||
  "https://ihvhgdavyl.execute-api.us-east-1.amazonaws.com/prod";

const formSchema = z.object({
  sku: z.string().min(2, { message: "Required" }),
  title: z.string().min(2, { message: "Required" }),
  description: z.string().min(2, { message: "Required" }),
  price: z.string().min(1, { message: "Required" }),
  currency: z.string().min(2, { message: "Required" }),
  category: z.string().min(2, { message: "Required" }),
  image: z.any().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function AddProduct() {
  const { token: authToken } = useAuth();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: "",
      title: "",
      description: "",
      price: "",
      currency: "USD",
      category: "",
      image: undefined,
    },
  });

  // cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // upload to S3 using axios with progress
  const uploadFileToS3 = async (url: string, file: File) => {
    await axios.put(url, file, {
      headers: { "Content-Type": file.type },
      onUploadProgress: (e) => {
        if (e.total) {
          setUploadProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
  };

  async function onSubmit(values: FormSchema) {
    const file: File | undefined = values.image as File | undefined;
    const product: Product = {
      sku: values.sku,
      title: values.title,
      description: values.description,
      price: Number(values.price),
      currency: values.currency,
      category: values.category,
    };

    const token = authToken || sessionStorage.getItem("token") || "";

    try {
      // 1) Create product metadata
      const saved = await addProduct(product, token);
      toast.success("Product metadata saved");

      // 2) Handle image upload if present
      if (file) {
        setUploadProgress(0);
        toast("Requesting presigned URL...");

        // 2.a Presign request
        const presignRes = await axios.post(
          `${API_BASE}/products/${saved.id}/presign-upload`,
          { filename: file.name, contentType: file.type },
          { headers: { Authorization: `Bearer ${token}`,  "Content-Type": "application/json", } }
        );

        const { url: presignedUrl, key } = presignRes.data;
        if (!presignedUrl || !key) {
          throw new Error("Presign response missing url/key");
        }

        toast("Uploading image to S3...");
        await uploadFileToS3(presignedUrl, file)
        .then(res => {
          console.log("Image uploaded successfully : ", res);
          toast.success("Image uploaded to S3");
        }).catch(err => {
          console.log('error uploading file to S3 : ', err);
        });

        // 2.b Confirm upload
        await axios.post(
          `${API_BASE}/products/${saved.id}/confirm-upload`,
          { key },
          { headers: { Authorization: `Bearer ${token}`,  "Content-Type": "application/json", } }
        ).then(res => {
          console.log('image key updated in DB : ', res);
          toast.success("Image confirmed and linked to product");
        }).catch(err => {
          console.log('error updating image key in DB : ', err);
        });
        
      }

      // Reset
      form.reset();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setUploadProgress(null);
    } catch (err) {
      console.error(err);
      setUploadProgress(null);
      toast.error("Failed to add product: " + err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-white px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">Add New Product</h1>
            <p className="text-blue-100">
              Fill in the details below to add a new product to store
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* sku & title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-gray-700 mb-2 block">
                          Product Identifier
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Product Identifier" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-gray-700 mb-2 block">
                          Product Title
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Product Name" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter Product Description" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* price & currency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Price</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" placeholder="Enter Price" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Currency</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-gray-50 text-gray-600" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Category</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Category" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Image */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Product Image (optional)</FormLabel>
                      <FormControl>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            field.onChange(f);
                            if (f) {
                              if (previewUrl) URL.revokeObjectURL(previewUrl);
                              setPreviewUrl(URL.createObjectURL(f));
                            } else {
                              if (previewUrl) {
                                URL.revokeObjectURL(previewUrl);
                                setPreviewUrl(null);
                              }
                            }
                          }}
                          ref={fileInputRef}
                          className="block w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </FormControl>
                      {previewUrl && (
                        <div className="mt-3 relative">
                          <img src={previewUrl} alt="preview" className="w-full h-56 object-cover rounded-xl" />
                          <button
                            type="button"
                            onClick={() => {
                              (field.onChange as (value: File | undefined) => void)(undefined);
                              if (previewUrl) {
                                URL.revokeObjectURL(previewUrl);
                                setPreviewUrl(null);
                              }
                              setUploadProgress(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                            className="absolute top-2 right-2 h-8 px-3 rounded-md bg-red-600 text-white text-sm shadow"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {uploadProgress !== null && (
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mt-2">
                    <div
                      style={{ width: `${uploadProgress}%` }}
                      className="h-full bg-indigo-600 transition-all"
                    />
                  </div>
                )}

                {/* Buttons */}
                <div className="pt-6 flex gap-4">
                  <Button type="submit" className="text-lg flex-1 bg-blue-600 text-white">Add Product</Button>
                  <Button
                    type="reset"
                    onClick={() => {
                      form.reset();
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                      }
                      setUploadProgress(null);
                    }}
                    className="text-lg flex-1 bg-gray-500 text-white"
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
