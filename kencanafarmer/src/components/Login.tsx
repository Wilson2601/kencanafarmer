import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Sprout } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  // Toggle between Login (true) and Sign Up (false)
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "" 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLogin ? "Logging in..." : "Signing up...", formData);
    // In a real app, you would send this to a backend.
    // For now, we simulate success for both:
    onLogin(); 
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex bg-green-100 p-4 rounded-full mb-4 shadow-sm">
            <Sprout className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-900">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-green-600 mt-2">
            {isLogin ? "Sign in to manage your farm" : "Join us to start farming smarter"}
          </p>
        </div>

        <div className="bg-white p-6 shadow-sm border border-green-100 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name (Only show if Signing Up) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-green-800 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-green-500" />
                  </div>
                  <input 
                    type="text" 
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-green-200 rounded-lg text-green-900 focus:ring-2 focus:ring-green-500/20 outline-none"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
               <label className="block text-sm font-medium text-green-800 mb-1.5">Email</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Mail className="h-5 w-5 text-green-500" />
                 </div>
                 <input 
                   type="email" 
                   required
                   className="w-full pl-10 pr-4 py-3 bg-white border border-green-200 rounded-lg text-green-900 focus:ring-2 focus:ring-green-500/20 outline-none"
                   placeholder="farmer@example.com"
                   value={formData.email}
                   onChange={e => setFormData({...formData, email: e.target.value})}
                 />
               </div>
            </div>

             {/* Password */}
             <div>
               <label className="block text-sm font-medium text-green-800 mb-1.5">Password</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-green-500" />
                 </div>
                 <input 
                   type="password" 
                   required
                   className="w-full pl-10 pr-4 py-3 bg-white border border-green-200 rounded-lg text-green-900 focus:ring-2 focus:ring-green-500/20 outline-none"
                   placeholder="••••••••"
                   value={formData.password}
                   onChange={e => setFormData({...formData, password: e.target.value})}
                 />
               </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm mt-2"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Toggle Button at the bottom */}
        <p className="text-center mt-8 text-green-700">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-green-800 hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}