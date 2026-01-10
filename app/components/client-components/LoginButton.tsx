"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

// A simple SVG for the Google logo for a cleaner look
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.082,5.571l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const UserLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, data: session } = useSession();
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isSignUp, setIsSignUp] = useState(false); // Toggle state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") || "/cart";

  // Redirect logic after successful login
  useEffect(() => {
    (async () => {
      if (status === "authenticated") {
        try {
            const data = {
                guestId: localStorage.getItem("guestId"),
                userId: session.user.userId as string,
            };
            if(data.guestId && data.userId){
                 await axios.post('/api/update-userid', data);
                 localStorage.removeItem("guestId");
            }
        } catch (error) {
            console.error("Error updating user ID:", error);
        }
        
        sessionStorage.removeItem("navigateAfterLogin");
        router.push(callbackUrl);
      }
    })();
  }, [status, router, session, callbackUrl]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload: any = { email };
      if (isSignUp && name) {
          payload.name = name;
      }
      
      const res = await axios.post("/api/auth/send-otp", payload);
      if (res.status === 200) {
        setStep("otp");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
        const result = await signIn("credentials", {
            redirect: false,
            email,
            otp,
          });
      
          if (result?.error) {
            setError("Invalid OTP");
          } else {
            // Success - Redirect handled by the useEffect above
          }
    } catch (err) {
         setError("Something went wrong");
    } finally {
        setLoading(false);
    }
   
  };

  // --- Main Page Layout ---
  return (
    <div className="flex items-center justify-center h-[calc(100vh-120px)] bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
                {isSignUp ? "Create an Account" : "Sign in to your account"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isSignUp ? "Join us to access exclusive features." : "Access your dashboard, settings, and more."}
            </p>
          </div>

          {/* Email/OTP Form */}
          <div className="mt-8">
            {step === "email" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                
                {isSignUp && (
                    <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        required={isSignUp}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="John Doe"
                    />
                    </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>

                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError("");
                            setName("");
                        }}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        {isSignUp 
                            ? "Already have an account? Sign In" 
                            : "Don't have an account? Sign Up"}
                    </button>
                </div>

              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="123456"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </button>
                <div className="flex justify-center gap-4 mt-2">
                    <button
                        type="button"
                        onClick={() => setStep("email")}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                        Different Email?
                    </button>
                </div>
              </form>
            )}
            
            <div className="mt-6 relative">
                 <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                 </div>
                 <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-sm text-gray-500">Or continue with</span>
                 </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => signIn("google", { callbackUrl })}
                className="flex items-center cursor-pointer justify-center w-full gap-3 px-4 py-3 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <GoogleIcon />
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
          <p className="mt-8 text-xs text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;