/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"register" | "confirm">("register");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email, name } },
      });
      setStep("confirm");
      setMessage("Check your email for a confirmation code.");
      navigate("/register");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      setMessage("Registration confirmed! You can now log in.");
      setStep("register");
      navigate("/login");
      setEmail("");
      setPassword("");
      setName("");
      setCode("");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-12 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
        {step === "register" ? (
          <>
           <div>
              <Label className="mb-1 block text-lg">Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label className="mb-1 block text-lg">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label className="mb-1 block text-lg">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>
            <Button onClick={handleRegister} className="w-full mt-2 text-lg">
              Register
            </Button>
          </>
        ) : (
          <>
            <div>
              <Label className="mb-1 block text-lg">Confirmation Code</Label>
              <Input
                type="text"
                value={code}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCode(e.target.value)}
                placeholder="123456"
              />
            </div>
            <Button onClick={handleConfirm} className="w-full mt-2 text-lg">
              Confirm Registration
            </Button>
          </>
        )}
        {message && <p className="text-sm text-red-500">{message}</p>}
      </CardContent>
    </Card>
  );
}
