// This file provides routes for Tempo storyboards
import { RouteObject } from "react-router-dom";
import { lazy } from "react";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const SyllabusPage = lazy(() => import("./pages/SyllabusPage"));
const LearnPage = lazy(() => import("./pages/LearnPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

const routes: RouteObject[] = [
  {
    path: "/tempobook/*",
    element: null, // Tempo will handle this route
  },
  // Add explicit routes for Tempo preview
  {
    path: "/",
    element: null,
  },
  {
    path: "/auth",
    element: null,
  },
  {
    path: "/home",
    element: null,
  },
  {
    path: "/syllabus",
    element: null,
  },
  {
    path: "/learn",
    element: null,
  },
  {
    path: "/profile",
    element: null,
  },
  // Catch-all route for Tempo preview
  {
    path: "*",
    element: null,
  },
];

export default routes;
