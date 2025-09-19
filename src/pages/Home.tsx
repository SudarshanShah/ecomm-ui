import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const API_BASE = import.meta.env.VITE_API_URL;

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addItem } = useCart();
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [lastAddedTitle, setLastAddedTitle] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();

    const dataWithImages = await Promise.all(
      data.map(async (p: Product) => {
        try {
          const res = await fetch(`${API_BASE}/products/${p.id}/image-url`);
          const { url } = await res.json();
          console.log('url = ', url);
          return { ...p, imageUrl: url };
        } catch (error) {
          console.log("Error occurred getting images : ", error);
        }
      })
    )

    setProducts(dataWithImages);
    // setProducts(data);
  };

  const handleAddToCart = (product: Product) => {
    if (!token) {
      navigate("/login");
    } else {
      addItem(product, 1);
      setLastAddedTitle(product.title);
      setShowCartDialog(true);
    }
  };

  const handleBuy = (product: Product) => {
    if (!token) {
      navigate("/login");
    } else {
      setLastAddedTitle(product.title);
      setShowCartDialog(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Discover Products
          </h1>
          <p className="text-slate-500 mt-1">
            Browse the latest items available in the store
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col h-full cursor-pointer"
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {product.imageUrl && (
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              )}
              <CardHeader className="space-y-2 flex-1">
                <CardTitle className="text-lg font-semibold text-slate-800 line-clamp-2">
                  {product.title}
                </CardTitle>
                <CardDescription className="text-slate-500 line-clamp-3">
                  {product.description}
                </CardDescription>
                <CardAction className="pt-1">
                  <span className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5">
                    {product.sku}
                  </span>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex items-center justify-between mt-auto pt-4">
                {/* <p className="text-xl font-bold text-slate-900">
                  ${product.price}
                </p> */}
                <Button
                  className="h-9 px-4 bg-black hover:bg-indigo-700 text-white rounded-md shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >Add to Cart</Button>
                <Button
                  className="h-9 px-4 bg-black hover:bg-indigo-700 text-white rounded-md shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuy(product);
                  }}
                >
                  Buy ${product.price}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      {/* Add to Cart Dialog */}
      <AlertDialog open={showCartDialog} onOpenChange={setShowCartDialog}>
        <AlertDialogContent>
          <div className="text-center py-4">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Added to Cart!</h2>
            <p className="text-slate-600 mb-6">
              {lastAddedTitle ? `"${lastAddedTitle}" has been added to your cart.` : "Item added to your cart."}
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
    </div>
  );
}

export default Home;
