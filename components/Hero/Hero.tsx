import React from "react";
import Button from "../Button";

export default function Hero() {
  return (
    <div className="mt-5 min-h-[800px] relative overflow-hidden bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#3949ab]">
      <div className="relative z-10 container mx-auto px-4 pt-40 pb-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white/90 tracking-wide max-w-4xl mx-auto mb-12">
          The Foundation Layer for AI3.0
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            size="lg"
            variant="secondary"
            className="text-gray-900 bg-white hover:bg-white/90 px-8 py-6 text-lg"
          >
            Start Farming
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
          >
            Discover Your Role
          </Button>
        </div>
      </div>
    </div>
  );
}
