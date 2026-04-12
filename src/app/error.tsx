"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";
import { Header, Footer } from "@/components/shared";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-luxury-black text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-16 md:pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto py-12 md:py-20">
          {/* Error Content */}
          <div className="text-center">
            {/* Error Icon */}
            <div className="mb-8 flex justify-center">
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-full">
                <AlertCircle className="w-16 h-16 text-red-400" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Something Went Wrong
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-400 mb-8">
              We encountered an unexpected error while processing your request.
              Don't worry, our team has been notified. Please try again or go back home.
            </p>

            {/* Error Details (if available) */}
            {error.message && (
              <div className="mb-8 p-4 bg-slate-800/50 border border-red-500/20 rounded-lg text-left">
                <p className="text-xs text-gray-500 mb-2">Error Details:</p>
                <p className="text-sm text-gray-300 font-mono break-words">
                  {error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-gold text-luxury-black font-semibold rounded-lg hover:shadow-lg hover:shadow-gold/50 transition-all duration-300"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </div>

            {/* Additional Help */}
            <div className="mt-12 p-6 bg-slate-800/30 border border-gold/10 rounded-lg">
              <p className="text-gray-400 mb-4">Need help?</p>
              <Link
                href="/contact"
                className="text-gold hover:text-brand-orange font-medium transition-colors"
              >
                Contact Our Support Team
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
