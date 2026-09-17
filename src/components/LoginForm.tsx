"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import AuthForm from "./AuthForm";
import { LoginSchema } from "@/types";
import toast from "react-hot-toast";

function formatAuthError(msg: string) {
  if (msg.includes("auth/user-not-found")) return "No account found with this email";
  if (msg.includes("auth/wrong-password")) return "Incorrect password";
  if (msg.includes("auth/invalid-credential")) return "Invalid email or password";
  if (msg.includes("auth/too-many-requests")) return "Too many attempts, please try again later";
  return msg;
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = LoginSchema.safeParse({ email, password });
    if (!result.success) {
      const formatted = result.error.format();
      setFieldErrors({
        email: formatted.email?._errors[0],
        password: formatted.password?._errors[0],
      });
      return;
    }
    
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully logged in!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(formatAuthError(err.message));
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Successfully logged in!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(formatAuthError(err.message));
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      title="Sign In"
      buttonText="Login"
      fieldErrors={fieldErrors}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onSubmit={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      isSubmitting={isSubmitting}
      altText="Don't have an account?"
      altLinkText="Sign Up"
      altLinkHref="/signup"
    />
  );
}
