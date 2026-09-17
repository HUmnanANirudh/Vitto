"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import AuthForm from "./AuthForm";
import { SignupSchema } from "@/types";
import toast from "react-hot-toast";

function formatAuthError(msg: string) {
  if (msg.includes("auth/email-already-in-use")) return "Email already in use";
  if (msg.includes("auth/invalid-email")) return "Invalid email address";
  if (msg.includes("auth/weak-password")) return "Password is too weak";
  return msg;
}

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = SignupSchema.safeParse({ name, email, password });
    if (!result.success) {
      const formatted = result.error.format();
      setFieldErrors({
        name: formatted.name?._errors[0],
        email: formatted.email?._errors[0],
        password: formatted.password?._errors[0],
      });
      return;
    }
    
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(formatAuthError(message));
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(formatAuthError(message));
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      title="Sign Up"
      buttonText="Create Account"
      fieldErrors={fieldErrors}
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onSubmit={handleSignup}
      onGoogleLogin={handleGoogleLogin}
      isSubmitting={isSubmitting}
      altText="Already have an account?"
      altLinkText="Login"
      altLinkHref="/login"
    />
  );
}
