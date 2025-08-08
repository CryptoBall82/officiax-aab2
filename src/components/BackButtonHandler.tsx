'use client';

import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core'; // Import the type
import { useRouter, usePathname } from 'next/navigation';

export default function BackButtonHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // We need a variable to hold the listener handle itself, not the promise
    let listenerHandle: PluginListenerHandle | undefined;

    const handleBackButton = ({ canGoBack }: { canGoBack: boolean }) => {
      console.log('Android back button pressed. Pathname:', pathname, 'CanGoBack (WebView):', canGoBack);
      const exitPaths = ['/', '/home', '/dashboard']; // Customize these

      if (exitPaths.includes(pathname)) {
        console.log('On an exit path, exiting app.');
        CapacitorApp.exitApp();
      } else {
        console.log('Navigating back using router.back()');
        router.back();
      }
    };

    // Create an async function inside useEffect to handle the listener setup
    const setupListener = async () => {
      if (typeof window !== 'undefined' && /android/i.test(window.navigator.userAgent)) {
        // Await the promise to get the actual listener handle
        listenerHandle = await CapacitorApp.addListener('backButton', handleBackButton);
        console.log('Android back button listener added.');
      }
    };

    // Call the async setup function
    setupListener();

    // The cleanup function, returned by useEffect
    return () => {
      // Check if the listener handle was created before trying to remove it
      if (listenerHandle) {
        console.log('Removing Android back button listener.');
        listenerHandle.remove();
      } else {
        console.log('Not on Android or listener not initialized, skipping removal.');
      }
    };
  }, [pathname, router]); // Dependencies remain the same

  return null; // This component doesn't render anything
}