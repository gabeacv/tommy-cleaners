"use client";

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.updateUser({
      password: password,
    });

    if (resetError) {
      setError(resetError.message);
      setIsLoading(false);
      return;
    }

    alert("Password updated successfully!");
    router.push("/staff");
  };

  return (
    <div className="flex min-h-screen bg-cloud flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-12 rounded-3xl shadow-2xl flex flex-col items-center">
        <h1 className="text-4xl font-cursive text-charcoal mb-2">Tommy Cleaners</h1>
        <p className="text-charcoal/40 uppercase tracking-[0.2em] text-xs font-bold mb-12">Set New Password</p>
        
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 w-full text-center text-sm">{error}</div>}

        <form onSubmit={handleReset} className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">New Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-cloud p-4 rounded-xl text-charcoal focus:outline-none focus:ring-1 focus:ring-primary transition-all transition-duration-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-charcoal/40 ml-1">Confirm New Password</label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-cloud p-4 rounded-xl text-charcoal focus:outline-none focus:ring-1 focus:ring-primary transition-all transition-duration-300"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`bg-charcoal text-white text-lg font-medium p-6 rounded-2xl hover:bg-charcoal/90 transition-all duration-300 shadow-xl mt-4 ${isLoading ? 'opacity-50 grayscale' : ''}`}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
