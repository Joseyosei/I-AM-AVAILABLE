import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import Landing from "./pages/Landing";
import Directory from "./pages/Directory";
import Pricing from "./pages/Pricing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProfileEditor from "./pages/ProfileEditor";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import SavedProfiles from "./pages/SavedProfiles";
import PostJob from "./pages/PostJob";
import Documentation from "./pages/Documentation";
import Profile from "./pages/Profile";
import Careers from "./pages/Careers";
import Chat from "./pages/Chat";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/about" element={<About />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/profile" element={<ProfileEditor />} />
              <Route path="/dashboard/analytics" element={<Analytics />} />
              <Route path="/dashboard/notifications" element={<Notifications />} />
              <Route path="/dashboard/saved" element={<SavedProfiles />} />
              <Route path="/dashboard/post-job" element={<PostJob />} />
              <Route path="/dashboard/chat" element={<Chat />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/profile/:username" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
