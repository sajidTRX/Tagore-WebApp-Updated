'use client';

import BootScreen from "@/components/boot-screen"
// Removed useState and parts of useEffect that are no longer needed for this page's direct functionality
// If this page were to have content *after* unlock, these might be re-added differently.

export default function Home() {
  // Removed selectedIndex, isBooting states
  // Removed modes array as it was tied to UI we removed and then a flow we changed
  // Removed useEffect for keyboard navigation as it was tied to the removed UI
  // Removed handleBootComplete function

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <BootScreen />
      {/* The BootScreen component will now handle navigation to /unlock */}
      {/* If content was meant to appear here *after* an unlock flow, that would be a different setup */}
    </main>
  )
}
