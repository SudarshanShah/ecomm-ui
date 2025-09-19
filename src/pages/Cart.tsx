import { useCart } from "@/context/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

function Cart() {
  const { items, updateQuantity, removeItem, clear } = useCart();
  const navigate = useNavigate();

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-slate-600 mb-6">Browse products and add them to your cart.</p>
          <Button onClick={() => navigate('/')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map(({ product, quantity }) => (
          <Card key={product.id}>
            <CardContent className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.title} className="w-20 h-20 object-cover rounded" crossOrigin="anonymous" />
                )}
                <div>
                  <div className="font-semibold">{product.title}</div>
                  <div className="text-sm text-slate-600">${product.price}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => updateQuantity(product.id!, Math.max(0, quantity - 1))}>-</Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button variant="outline" onClick={() => updateQuantity(product.id!, quantity + 1)}>+</Button>
              </div>
              <div className="font-semibold">${(product.price * quantity).toFixed(2)}</div>
              <Button variant="outline" onClick={() => removeItem(product.id!)}>Remove</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-xl font-semibold">Total</div>
          <div className="text-xl font-bold">${total.toFixed(2)}</div>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button variant="outline" onClick={clear}>Clear Cart</Button>
        <Button onClick={() => {
            clear()
            navigate('/')
        }} className="bg-indigo-600 hover:bg-indigo-700">Checkout</Button>
      </div>
    </div>
  );
}

export default Cart;


