"use client";

import React, { useEffect } from "react";
import Script from "next/script";
import { getSessionStorage, setSessionStorage } from "@/lib/localStorage";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // This helps ensure the CAPTCHA script is loaded properly
  useEffect(() => {
    // Refresh the page only once if there was a CAPTCHA error
    const hasCaptchaError = getSessionStorage("captchaError", false);
    const captchaErrorMessage = "Cannot initialize Smart CAPTCHA widget because the `clerk-captcha` DOM element was not found";
    
    // Check console for CAPTCHA errors
    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
      const message = args.join(" ");
      if (message.includes(captchaErrorMessage) && !hasCaptchaError) {
        setSessionStorage("captchaError", true);
        // Force reload once to ensure the DOM is ready for CAPTCHA
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }
      originalConsoleWarn.apply(console, args);
    };
    
    return () => {
      console.warn = originalConsoleWarn;
      sessionStorage.removeItem("captchaError");
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Preload Clerk's CAPTCHA script to ensure it's available */}
      <Script 
        src="https://clerk.com/npm/@clerk/clerk-js@latest/dist/clerk.browser.js"
        strategy="beforeInteractive"
      />
      {children}
    </div>
  );
}
