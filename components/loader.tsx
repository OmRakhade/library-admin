// components/Loader.tsx
export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50">
      <div className="relative w-16 h-16">
        {/* Stack of books */}
        <div className="absolute w-16 h-2 bg-blue-500 rounded-lg animate-bounce-delay-1 top-0"></div>
        <div className="absolute w-16 h-2 bg-purple-500 rounded-lg animate-bounce-delay-2 top-4"></div>
        <div className="absolute w-16 h-2 bg-pink-500 rounded-lg animate-bounce-delay-3 top-8"></div>
        <div className="absolute w-16 h-2 bg-green-400 rounded-lg animate-bounce-delay-4 top-12"></div>
      </div>
      <p className="mt-6 text-gray-700 font-semibold text-lg animate-pulse">
        Loading ...
      </p>

      <style jsx>{`
        @keyframes bounceDelay1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bounceDelay2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes bounceDelay3 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes bounceDelay4 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        .animate-bounce-delay-1 {
          animation: bounceDelay1 0.6s ease-in-out infinite;
        }
        .animate-bounce-delay-2 {
          animation: bounceDelay2 0.6s ease-in-out infinite;
        }
        .animate-bounce-delay-3 {
          animation: bounceDelay3 0.6s ease-in-out infinite;
        }
        .animate-bounce-delay-4 {
          animation: bounceDelay4 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
