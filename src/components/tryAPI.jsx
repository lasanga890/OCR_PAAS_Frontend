import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, Code } from "lucide-react";
import NavBar from "./NavBar";

export default function TryApi() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // 🔹 Load user from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      setError("You must be signed in to access this page.");
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Please sign in to access the API.",
        className: "bg-red-100 text-red-800",
      });
      navigate("/auth");
    }
  }, [navigate, toast]);

  const handleApiTest = async () => {
    setIsLoading(true);
    setError("");
    setApiResponse("");
    try {
      const res = await fetch("http://localhost:5000/api1/test", {
        method: "GET",
        credentials: "include", // ensures cookies are sent
      });
      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
      toast({
        title: "Success!",
        description: "API request completed successfully.",
        className: "bg-green-100 text-green-800",
      });
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch API data";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "API Request Failed",
        description: errorMessage,
        className: "bg-red-100 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Try Our API
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test our API endpoints securely. Make authenticated requests and view the responses below.
          </p>
          {currentUser && (
            <p className="mt-4 text-lg text-gray-700">
              Welcome, <span className="font-semibold">{currentUser.name || currentUser.email}</span> 🎉
            </p>
          )}
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-600 mb-1">Error</h3>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <button
            onClick={handleApiTest}
            disabled={isLoading}
            className={`w-full max-w-xs mx-auto flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-colors shadow-md ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Testing API...</span>
              </>
            ) : (
              <>
                <Code className="h-5 w-5" />
                <span>Test API Endpoint</span>
              </>
            )}
          </button>
        </div>

        {apiResponse && (
          <div className="animate-fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <Code className="h-5 w-5 text-blue-500" />
              <h2 className="text-2xl font-semibold text-gray-800">API Response</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto shadow-sm">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 font-mono">
                {apiResponse}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
