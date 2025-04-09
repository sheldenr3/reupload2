/**
 * Utility functions for handling client-side routing
 */

/**
 * Ensures that the browser history API is properly used for navigation
 * This helps prevent 404 errors when refreshing the page on dynamic routes
 */
export function setupRouterUtils() {
  // Only run in browser environment
  if (typeof window === "undefined") return;

  // Intercept all link clicks to use history API
  document.addEventListener("click", (e) => {
    // Only process link clicks
    const target = e.target as HTMLElement;
    const link = target.closest("a");
    if (!link) return;

    // Only handle internal links
    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("http") ||
      href.startsWith("//") ||
      href.startsWith("#")
    )
      return;

    // Use history API instead of full page navigation
    e.preventDefault();
    window.history.pushState({}, "", href);
    // Dispatch a popstate event to notify the router
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}
