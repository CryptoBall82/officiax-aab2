'use client'; // This directive makes this component a Client Component

import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { useRouter, usePathname } from 'next/navigation';

export default function BackButtonHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleBackButton = async ({ canGoBack }: { canGoBack: boolean }) => {
      console.log('Android back button pressed. Pathname:', pathname, 'CanGoBack (WebView):', canGoBack);

      // Define paths where you want to exit the app instead of going back
      // Example: your main dashboard or root path
      const exitPaths = ['/', '/home', '/dashboard']; // Customize these

      if (exitPaths.includes(pathname)) {
        console.log('On an exit path, exiting app.');
        await CapacitorApp.exitApp();
      } else {
        // Mimic the behavior of an in-app chevron (router.back())
        // This leverages Next.js's navigation history
        console.log('Navigating back using router.back()');
        router.back();
      }
      // Note: `window.history.back()` is another option for simpler scenarios,
      // but router.back() is generally preferred with Next.js for consistency.

      // If you strictly want to rely on WebView's canGoBack and exit if not:
      /*
      if (canGoBack) {
        window.history.back(); // Or router.back()
      } else {
        CapacitorApp.exitApp();
      }
      */
    };

    // Add listener only on the Android platform
    if (typeof window !== 'undefined' && window.navigator && /android/i.test(window.navigator.userAgent)) {
       const listener = CapacitorApp.addListener('backButton', handleBackButton);
       console.log('Android back button listener added.');

       return () => {
         console.log('Removing Android back button listener.');
         listener.remove();
       };
    } else {
        console.log('Not on Android, back button listener not added.');
        return () => {}; // No-op cleanup for non-Android
    }
  }, [pathname, router]); // Re-run if pathname or router instance changes

  return null; // This component doesn't render anything itself
}
