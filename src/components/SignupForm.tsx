"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import AuthForm from "./AuthForm";
import { SignupSchema } from "@/types";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      title="Sign Up"
      buttonText="Create Account"
      error={error}
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
