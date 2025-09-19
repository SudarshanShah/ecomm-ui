import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Tag, Wallet } from "lucide-react";
import type { Product } from "@/types/Product";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"

const API_BASE = import.meta.env.VITE_API_URL;

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id));
    }
  }, [id]);

  const fetchProduct = async (productId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch product details
      const response = await fetch(`${API_BASE}/products/${productId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }
      
      const productData = await response.json();
      
      // Fetch product image
      try {
        const imageResponse = await fetch(`${API_BASE}/products/${productId}/image-url`);
        const { url } = await imageResponse.json();
        productData.imageUrl = url;
      } catch (imageError) {
        console.log("Error fetching product image:", imageError);
      }
      
      setProduct(productData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!token) {
      navigate("/login");
    } else {
      if (product) addItem(product, 1);
      setShowCartDialog(true);
    }
  };

  const handleBuyNow = () => {
    if (!token) {
      navigate("/login");
    } else {
      setShowOrderDialog(true);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
          <p className="text-slate-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Button onClick={handleBack} className="bg-indigo-600 hover:bg-indigo-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square w-full overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-200 flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <div className="text-4xl mb-2">📦</div>
                      <p>No image available</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold text-slate-800 mb-2">
                      {product.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1">
                        <Tag className="w-3 h-3 mr-1" />
                        {product.sku}
                      </span>
                      <span className="inline-flex items-center text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-slate-900">
                    ${product.price}
                  </div>
                  {product.currency && (
                    <span className="text-slate-500 text-lg">
                      {product.currency}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Description</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                 <div className="flex flex-col sm:flex-row gap-4">
                   <Button
                     onClick={handleAddToCart}
                     className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                   >
                     <ShoppingCart className="w-5 h-5 mr-2" />
                     {token ? "Add to Cart" : "Login to Buy"}
                   </Button>
                   
                   <Button
                     variant="outline"
                     className="flex-1 h-12 border-slate-500 bg-black text-white hover:text-slate-700 hover:bg-white"
                     onClick={handleBuyNow}
                   >
                     <Wallet className="w-5 h-5 mr-2" />
                     Buy Now
                   </Button>
                 </div>

                {/* Product Specifications */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Product Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">SKU:</span>
                        <span className="font-medium text-slate-800">{product.sku}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Category:</span>
                        <span className="font-medium text-slate-800">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Price:</span>
                        <span className="font-medium text-slate-800">${product.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
         </div>
       </div>

       {/* Add to Cart Dialog */}
       <AlertDialog open={showCartDialog} onOpenChange={setShowCartDialog}>
         <AlertDialogContent>
           <div className="text-center py-4">
             <div className="text-green-500 text-6xl mb-4">✅</div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">Added to Cart!</h2>
             <p className="text-slate-600 mb-6">
               "{product?.title}" has been successfully added to your cart.
             </p>
           </div>
           <AlertDialogFooter className="justify-center">
             <AlertDialogAction 
               onClick={() => setShowCartDialog(false)}
               className="bg-indigo-600 hover:bg-indigo-700"
             >
               OK
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>

       {/* Order Placed Dialog */}
       <AlertDialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
         <AlertDialogContent>
           <div className="text-center py-4">
             <div className="text-green-500 text-6xl mb-4">🎉</div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Placed!</h2>
             <p className="text-slate-600 mb-6">
               Your order for "{product?.title}" has been successfully placed. You will receive a confirmation email shortly.
             </p>
           </div>
          <AlertDialogFooter className="justify-center">
            <AlertDialogAction 
              onClick={() => { setShowOrderDialog(false); navigate('/'); }}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
     </div>
   );
 }
 
 export default ProductDetail;
