import Link from "next/link";
import { AuthFormProps } from "@/types";
import Gradient from "@/components/Gradient";

export default function AuthForm({
  title,
  buttonText,
  error,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onGoogleLogin,
  altText,
  altLinkText,
  altLinkHref,
}: AuthFormProps) {
  return (
    <div className="flex min-h-screen w-full bg-white text-gray-900">
      <Gradient />

      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm border border-gray-100">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">{title}</h1>
          {error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600 border border-red-100">{error}</div>}
          
          <form onSubmit={onSubmit}>
            {setName && (
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={name || ""}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full rounded-md bg-blue-600 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              {buttonText}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <span className="w-1/5 border-b lg:w-1/4"></span>
            <span className="text-xs text-center text-gray-500 uppercase">Or continue with</span>
            <span className="w-1/5 border-b lg:w-1/4"></span>
          </div>

          <button 
            type="button" 
            onClick={onGoogleLogin}
            className="mt-4 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2.5 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            {altText} <Link href={altLinkHref} className="font-medium text-blue-600 hover:underline">{altLinkText}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
