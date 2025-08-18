import React, { useState } from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onGoogleClickHandler = async () => {
    setIsLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const results = await signInWithPopup(auth, provider);
      const body = JSON.stringify({
        name: results.user.displayName,
        email: results.user.email,
        photo: results.user.photoURL,
      });
      const res = await fetch("http://localhost:5000/api1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      dispatch(signInSuccess(data));
      toast({
        title: "Success!",
        description: "Signed in with Google successfully.",
        className: "bg-green-100 text-green-800",
      });
      navigate("/try-api"); // Redirect to TryApi page
    } catch (err) {
      const errorMessage = err.message || "Unable to connect with Google";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: errorMessage,
        className: "bg-red-100 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onEmailSignInHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const auth = getAuth(app);
      const results = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const body = JSON.stringify({
        name: results.user.displayName || "Anonymous",
        email: results.user.email,
        photo: results.user.photoURL || null,
      });
      const res = await fetch("http://localhost:5000/api1/auth/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      dispatch(signInSuccess(data));
      toast({
        title: "Success!",
        description: "Signed in with email successfully.",
        className: "bg-green-100 text-green-800",
      });
      navigate("/try-api"); // Redirect to TryApi page
    } catch (err) {
      const errorMessage = err.message || "Email/Password sign-in failed";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: errorMessage,
        className: "bg-red-100 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onEmailSignUpHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const auth = getAuth(app);
      const results = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const body = JSON.stringify({
        name: formData.name || "Anonymous",
        email: results.user.email,
        photo: results.user.photoURL || null,
      });
      const res = await fetch("http://localhost:5000/api1/auth/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      dispatch(signInSuccess(data));
      toast({
        title: "Success!",
        description: "Account created successfully.",
        className: "bg-green-100 text-green-800",
      });
      navigate("/try-api"); // Redirect to TryApi page
    } catch (err) {
      const errorMessage = err.message || "Account creation failed";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Sign-Up Failed",
        description: errorMessage,
        className: "bg-red-100 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isSignUp ? "Create an Account" : "Sign In to Access API"}
        </h1>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-600 mb-1">Error</h3>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        )}
        <button
          onClick={onGoogleClickHandler}
          disabled={isLoading}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-colors shadow-md mb-6 ${
            isLoading
              ? "bg-gray-300 cursor-not-allowed text-gray-600"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C6.735,2,2,6.735,2,12.545s4.735,10.545,10.545,10.545c5.811,0,10.545-4.735,10.545-10.545c0-0.971-0.129-1.911-0.368-2.811H12.545z"
                />
              </svg>
              <span>Sign {isSignUp ? "Up" : "In"} with Google</span>
            </>
          )}
        </button>
        <div className="my-6 border-t text-center">
          <span className="relative top-[-0.75rem] bg-white px-4 text-sm text-gray-600 font-medium">
            Or {isSignUp ? "sign up" : "sign in"} with email
          </span>
        </div>
        <form onSubmit={isSignUp ? onEmailSignUpHandler : onEmailSignInHandler} className="space-y-4">
          {isSignUp && (
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:bg-white placeholder-gray-500"
              disabled={isLoading}
            />
          )}
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:bg-white placeholder-gray-500"
            disabled={isLoading}
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:bg-white placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-colors shadow-md ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6M23 11h-6" />
            </svg>
            <span>{isSignUp ? "Sign Up" : "Sign In"}</span>
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600 text-center">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="border-b border-gray-500 border-dotted hover:text-blue-500 focus:outline-none"
          >
            {isSignUp ? "Sign In" : "Create an Account"}
          </button>
        </p>
      </div>
    </div>
  );
}