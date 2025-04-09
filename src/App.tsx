import { Suspense, lazy } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
// Import routes for Tempo
import tempoRoutes from "./tempo-routes";
import Layout from "./components/layout/Layout";
import ExplainThisButton from "./components/explain/ExplainThisButton";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const SyllabusPage = lazy(() => import("./pages/SyllabusPage"));
const LearnPage = lazy(() => import("./pages/LearnPage"));
const TestsPage = lazy(() => import("./pages/TestsPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const StudyBuddyPage = lazy(() => import("./pages/StudyBuddyPage"));
const LabsPage = lazy(() => import("./pages/LabsPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

import { PointsProvider } from "@/contexts/PointsContext";
import { StudyBuddyProvider } from "@/contexts/StudyBuddyContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  console.log("ProtectedRoute - Auth state:", {
    user,
    loading,
    path: location.pathname,
  });

  // Show loading indicator while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0197cf]"></div>
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedRoute - No user, redirecting to auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute - User authenticated, rendering children");
  return <>{children}</>;
}

// Root component to handle initial redirect
function RootRedirect() {
  const { user, loading } = useAuth();
  console.log("RootRedirect - Auth state:", { user, loading });

  // Don't redirect while still loading auth state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0197cf] mb-4"></div>
        <p className="text-[#0197cf] text-lg">Loading application...</p>
        <p className="text-sm text-gray-500 mt-2">
          Please wait while we set up your learning environment
        </p>
      </div>
    );
  }

  // Force redirect to auth page regardless of user state
  // This ensures we always start from a clean authentication flow
  return <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <PointsProvider>
          <StudyBuddyProvider>
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  Loading...
                </div>
              }
            >
              {/* For the tempo routes - must be outside of Routes */}
              {import.meta.env.VITE_TEMPO === "true" && useRoutes(tempoRoutes)}

              <Routes>
                {/* Root redirect - Auth page is now the default */}
                <Route path="/" element={<RootRedirect />} />
                <Route index element={<RootRedirect />} />

                {/* Auth routes */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/payment" element={<PaymentPage />} />

                {/* Protected routes */}
                <Route element={<Layout />}>
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <HomePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/syllabus"
                    element={
                      <ProtectedRoute>
                        <SyllabusPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/learn"
                    element={
                      <ProtectedRoute>
                        <LearnPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ask-question"
                    element={
                      <ProtectedRoute>
                        <LearnPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tests"
                    element={
                      <ProtectedRoute>
                        <TestsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/resources"
                    element={
                      <ProtectedRoute>
                        <ResourcesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/study-buddy"
                    element={
                      <ProtectedRoute>
                        <StudyBuddyPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/labs"
                    element={
                      <ProtectedRoute>
                        <LabsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/library"
                    element={
                      <ProtectedRoute>
                        <LibraryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Add this before the catchall route */}
                  {import.meta.env.VITE_TEMPO === "true" && (
                    <Route path="/tempobook/*" element={<div />} />
                  )}

                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>

              {/* Global Explain This Button */}
              <ExplainThisButton />
            </Suspense>
          </StudyBuddyProvider>
        </PointsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
