/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { signIn, fetchAuthSession } from "aws-amplify/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signIn({ username: email, password });
      const session = await fetchAuthSession();
      console.log('session tokens : ', session.tokens)
      const token = session.tokens?.idToken?.toString();
      if (!token) throw new Error("No token received");
      login(token) // set the token in global context
      sessionStorage.setItem("token", token);
      setMessage(`Login successful!`);
      navigate("/");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-12 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl text-center">Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
        <div>
          <Label className="mb-1 block text-lg">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <Label className="mb-1 block text-lg">Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>
        <Button onClick={handleLogin} className="w-full mt-2 text-lg">
          Sign in
        </Button>
        {message && <p className="text-sm text-red-500">{message}</p>}
      </CardContent>
    </Card>
  );
}
