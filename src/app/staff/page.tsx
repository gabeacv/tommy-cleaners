"use client";

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: loginError, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setIsLoading(false);
      return;
    }

    // Role check to redirect
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      window.location.href = "/staff/admin/calendar";
    } else {
      window.location.href = "/staff/employee/calendar";
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/staff/reset-password`,
    });
    
    if (error) {
      setError(error.message);
    } else {
      alert("Password reset link sent to your email.");
      setShowReset(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-cloud flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-12 rounded-3xl shadow-2xl flex flex-col items-center">
        <h1 className="text-4xl font-cursive text-charcoal mb-2">Tommy Cleaners</h1>
        <p className="text-charcoal/40 uppercase tracking-[0.2em] text-xs font-bold mb-12">Staff Portal</p>
        
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 w-full text-center text-sm">{error}</div>}

        <form onSubmit={showReset ? handleReset : handleLogin} className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-cloud p-4 rounded-xl text-charcoal focus:outline-none focus:ring-1 focus:ring-primary transition-all transition-duration-300"
            />
          </div>

          {!showReset && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-cloud p-4 rounded-xl text-charcoal focus:outline-none focus:ring-1 focus:ring-primary transition-all transition-duration-300"
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`bg-charcoal text-white text-lg font-medium p-6 rounded-2xl hover:bg-charcoal/90 transition-all duration-300 shadow-xl mt-4 ${isLoading ? 'opacity-50 grayscale' : ''}`}
          >
            {isLoading ? "Please wait..." : (showReset ? "Send Reset Link" : "Log In")}
          </button>

          <button 
            type="button"
            onClick={() => setShowReset(!showReset)}
            className="text-xs text-charcoal/40 hover:text-primary transition-colors mt-2"
          >
            {showReset ? "Back to Login" : "Forgot your password?"}
          </button>
        </form>
      </div>

      <Link href="/" className="mt-12 text-sm text-charcoal/40 hover:text-primary tracking-widest uppercase flex items-center gap-2">
        <span>← Back to Site</span>
      </Link>
    </div>
  );
}
