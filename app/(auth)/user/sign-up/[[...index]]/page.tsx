import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return(
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Optional background image
            <Image
              src="/bg-pattern.jpg" // Put a nice image inside /public folder
              alt="Background"
              fill
              className="object-cover opacity-30 blur-sm"
            /> */}
      
            {/* Blur card */}
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-6 sm:p-10 w-[90%] max-w-md z-10 border border-white/20">
              <h1>for User</h1>
              <SignUp
                appearance={{
                  elements: {
                    formButtonPrimary:
                      "bg-[#6c47ff] hover:bg-[#5a3bd1] text-white font-semibold shadow-md",
                    card: "bg-transparent shadow-none",
                    headerTitle: "text-black",
                    headerSubtitle: "text-gray-500",
                    formFieldLabel: "text-black",
                    formFieldInput:
                      "bg-white/20 backdrop-blur-sm text-white border-white/30 placeholder-white/60",
                  },
                }}
              />
        </div>
   
   </div>
  );
}
