import React from 'react';
import { Share2 } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 flex-col justify-between text-white relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-x-10 translate-y-10"></div>

        
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
            <Share2 className="w-8 h-8 text-white animate-pulse" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            Nexus
          </span>
        </div>

        
        <div className="max-w-md my-auto relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Where ideas connect and grow.
          </h1>
          <p className="text-indigo-100 text-lg font-medium leading-relaxed">
            Join a global community of creators, thinkers, and builders. Share your thoughts, customize your space, and find your niche.
          </p>
        </div>

        
        <div className="text-sm text-indigo-200 relative z-10">
          &copy; 2026 Nexus Inc. All rights reserved.
        </div>
      </div>

      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Share2 className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold tracking-tight">Nexus</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}