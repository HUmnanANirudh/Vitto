import Link from "next/link";
import { AuthFormProps } from "@/types";

export default function AuthForm({
  title,
  buttonText,
  error,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  altText,
  altLinkText,
  altLinkHref,
}: AuthFormProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="w-96 rounded-lg bg-white p-8 shadow-md text-gray-900">
        <h1 className="mb-6 text-2xl font-bold">{title}</h1>
        {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded border bg-white p-2 text-gray-900 placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full rounded border bg-white p-2 text-gray-900 placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full rounded bg-blue-600 p-2 text-white">
          {buttonText}
        </button>
        <p className="mt-4 text-sm">
          {altText} <Link href={altLinkHref} className="text-blue-600">{altLinkText}</Link>
        </p>
      </form>
    </div>
  );
}
