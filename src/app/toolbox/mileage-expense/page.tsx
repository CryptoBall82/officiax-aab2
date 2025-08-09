// src/app/toolbox/mileage-expense/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarTools } from '@/components/NavbarTools';
import { Button } from '@/components/ui/button';
import { AlertCircle, CameraIcon, XCircle, Download } from 'lucide-react'; // Added icons
// Remove direct require and any types
// let Camera: any;
// let CameraResultType: any;
// let CameraSource: any;

// Import types from capacitor
import { Camera as CapacitorCamera, CameraResultType as CapacitorCameraResultType, CameraSource as CapacitorCameraSource } from '@capacitor/camera';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// --- Data Interfaces ---
interface Trip {
  id: string;
  date: string;
  purpose: 'business' | 'personal';
  mileage: number;
  startLocation?: string;
  endLocation?: string;
  notes?: string;
  type: 'trip';
}

interface Expense {
  id: string;
  date: string;
  purpose: 'business' | 'personal';
  description: string;
  amount: number;
  receiptImage?: string;
  type: 'expense';
}

type LogEntry = Trip | Expense;

// Main Component
export default function MileageExpenseTrackerPage() {
  const [activeSection, setActiveSection] = useState<'addTrip' | 'addExpense' | 'viewLog'>('addTrip');
  const [tripForm, setTripForm] = useState({
    date: '',
    purpose: 'business',
    mileage: '', // Stored as string to handle empty input and display
    startLocation: '',
    endLocation: '',
    notes: ''
  });
  const [expenseForm, setExpenseForm] = useState({
    date: '',
    purpose: 'business',
    description: '',
    amount: '',
    receiptImage: '' // Initialize receiptImage in expenseForm
  });
  // Removed the 3 fake log entries
  const [logData, setLogData] = useState<LogEntry[]>([]);

  const [isCalculatingMileage, setIsCalculatingMileage] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
  // New state to control if mileage calculation is active
  const [isMileageCalculationActive, setIsMileageCalculationActive] = useState(false); // Set to false to deactivate
  const [receiptImagePreview, setReceiptImagePreview] = useState<string | null>(null); // State for image preview

   // State to hold the dynamically imported Capacitor Camera object
   const [capacitorCamera, setCapacitorCamera] = useState<{ Camera: typeof CapacitorCamera, CameraResultType: typeof CapacitorCameraResultType, CameraSource: typeof CapacitorCameraSource } | null>(null);


  useEffect(() => {
    // Dynamically import Capacitor Camera
    const importCapacitorCamera = async () => {
      try {
        const cameraModule = await import('@capacitor/camera');
 setCapacitorCamera(cameraModule);
      } catch {
        console.warn('Capacitor Camera plugin not available (running on web?). Feature disabled.');
      }
    };

    importCapacitorCamera();

    // Check if the Google Maps API key is available in environment variables
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setIsApiKeyMissing(true);
      console.error("CRITICAL CONFIGURATION ERROR: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set in the environment variables.");
      // Only show error if the feature is meant to be active
      if (isMileageCalculationActive) {
        showMessage('error', 'Google Maps API Key is not configured. Mileage calculation is disabled.');
      }
    } else {
      // If API key is present, and we want to activate the feature, set to true
      // For now, it remains false as per user request to deactivate.
       setIsMileageCalculationActive(true); // Uncommented to activate if key is present
    }
  }, [isMileageCalculationActive]); // Dependency added to react to changes in active state

  /**
   * Displays a temporary message to the user.
   * @param type - Type of message ('success', 'error', 'info').
   * @param text - The message content.
   */
  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    // Clear the message after 10 seconds
    setTimeout(() => setMessage(null), 10000);
  };

  /**
   * Handles the calculation of mileage using Google Maps Directions API.
   */
  const handleCalculateMileage = async () => {
    // If mileage calculation is not active, do nothing
    if (!isMileageCalculationActive) {
      showMessage('info', 'Mileage calculation is temporarily deactivated.');
      return;
    }

    // Ensure both start and end locations are provided
    if (!tripForm.startLocation || !tripForm.endLocation) {
      showMessage('error', 'Please enter both start and end locations.');
      return;
    }

    // If API key is missing, prevent calculation
    if (isApiKeyMissing) {
      showMessage('error', 'Cannot calculate mileage: Google Maps API Key is missing.');
      return;
    }

    setIsCalculatingMileage(true);
    showMessage('info', 'Calculating mileage...');

    try {
      const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const origin = encodeURIComponent(tripForm.startLocation);
      const destination = encodeURIComponent(tripForm.endLocation);
      // Construct the Google Directions API URL
      const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&units=imperial&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(apiUrl);

      // Check for non-OK HTTP responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Attempt to parse error JSON
        const errorMsg = errorData.error_message || `API returned status ${response.status}. Check API Key, enabled APIs, and billing.`;
        throw new Error(`Google Maps API error: ${errorMsg}`);
      }

      const data = await response.json();
      // Check if the API call was successful and returned routes
      if (data.status === "OK" && data.routes && data.routes.length > 0) {
        const leg = data.routes[0].legs[0]; // Get the first leg of the first route
        const distanceInMeters = leg.distance.value;
        const calculatedMileage = distanceInMeters * 0.000621371; // Convert meters to miles
        setTripForm(prev => ({ ...prev, mileage: calculatedMileage.toFixed(1) })); // Update mileage in form
        showMessage('success', `Mileage calculated: ${calculatedMileage.toFixed(1)} miles`);
      } else {
        // Handle cases where API returns OK status but no routes (e.g., invalid addresses)
        throw new Error(data.error_message || data.status || "No route found. Please check addresses.");
      }
    } catch (error: unknown) { // Changed from any
      console.error('Error during mileage calculation:', error);
      // Provide user-friendly error messages, especially for CORS/API key issues
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'your-app-origin';
      let displayError = `Mileage calculation failed.\n\n`;

      let errorDetail = '';
       if (error instanceof Error) {
           errorDetail = error.message;
       } else if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
            errorDetail = (error as { message: string }).message;
       } else {
           errorDetail = String(error); // Convert other types to string
       }


      if (errorDetail.includes('Failed to fetch')) {
        displayError += `This is most likely a CORS (security) issue.\n\nTo fix this, you must authorize your app's domain in the Google Cloud Console:\n1. Open your Google Maps API key settings.\n2. Under "Application restrictions", choose "HTTP referrers".\n3. Add this URL to the allowed list: ${currentOrigin}\n\n`;
      } else {
        displayError += `Reason: ${errorDetail}\n\n`;
      }
      displayError += `Also verify that the "Directions API" is enabled and project billing is active.`;
      showMessage('error', displayError);
    } finally {
      setIsCalculatingMileage(false);
    }
  };

  /**
   * Handles adding a new trip entry to the log.
   */
  const handleAddTrip = () => {
    // Basic validation for trip form
    if (!tripForm.date || !tripForm.mileage || parseFloat(tripForm.mileage) <= 0) {
        showMessage('error', 'Please enter a date and valid mileage before adding the trip.');
        return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(), // Unique ID for the entry
      date: tripForm.date,
      purpose: tripForm.purpose as 'business' | 'personal',
      mileage: parseFloat(tripForm.mileage) || 0,
      startLocation: tripForm.startLocation,
      endLocation: tripForm.endLocation,
      notes: tripForm.notes,
      type: 'trip', // Differentiate from expense
    };
    // Add new trip and sort by date (most recent first)
    setLogData(prev => [...prev, newTrip].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    // Reset form fields
    setTripForm({ date: '', purpose: 'business', mileage: '', startLocation: '', endLocation: '', notes: '' });
    setActiveSection('viewLog'); // Switch to view log after adding
    showMessage('success', 'Trip added successfully!');
  };

  /**
   * Handles adding a new expense entry to the log.
   */
  const handleAddExpense = () => {
    // Basic validation for expense form
    if (!expenseForm.date || !expenseForm.description || !expenseForm.amount || parseFloat(expenseForm.amount) <= 0) {
        showMessage('error', 'Please enter a date, description, and valid amount for the expense.');
        return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(), // Unique ID for the entry
      date: expenseForm.date,
      purpose: expenseForm.purpose as 'business' | 'personal',
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount) || 0,
      receiptImage: expenseForm.receiptImage, // Include the captured image
      type: 'expense', // Differentiate from trip
    };
    // Add new expense and sort by date (most recent first)
    setLogData(prev => [...prev, newExpense].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    // Reset form fields and clear image preview
    setExpenseForm({ date: '', purpose: 'business', description: '', amount: '', receiptImage: '' });
    setReceiptImagePreview(null); // Clear the preview after adding
    setActiveSection('viewLog'); // Switch to view log after adding
    showMessage('success', 'Expense added successfully!');
  };

  /**
   * Handles capturing a receipt photo using Capacitor Camera plugin.
   */
  const handleAddReceipt = async () => {
     // Check if Capacitor Camera is loaded
     if (!capacitorCamera) {
        showMessage('error', 'Camera feature is not available on this platform.');
        return;
     }
    try {
      const photo = await capacitorCamera.Camera.getPhoto({
        quality: 90,
        allowEditing: false, // Set to true if you want users to crop/edit
        resultType: capacitorCamera.CameraResultType.Base64, // Get image as base64 string
        source: capacitorCamera.CameraSource.Prompt, // Ask user to choose between camera or photo album
        webUseInput: true // Required for web-based Capacitor apps to fallback to file input
      });

      if (photo.base64String) {
        // Set the base64 string to the form state and preview state
        setExpenseForm(prev => ({ ...prev, receiptImage: photo.base64String! }));
        setReceiptImagePreview(`data:image/jpeg;base64,${photo.base64String}`);
        showMessage('success', 'Receipt photo captured!');
      } else {
        showMessage('info', 'No photo captured.');
      }
    } catch (error: unknown) { // Changed from any
      console.error('Error capturing photo:', error);
      // More user-friendly error messages depending on the error type
      let errorDetail = '';
       if (error instanceof Error) {
           errorDetail = error.message;
       } else if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
            errorDetail = (error as { message: string }).message;
       } else {
           errorDetail = String(error); // Convert other types to string
       }

      if (errorDetail.includes('User cancelled photos app')) {
        showMessage('info', 'Photo capture cancelled.');
      } else if (errorDetail.includes('No camera available')) {
        showMessage('error', 'No camera available or permission denied.');
      } else {
        showMessage('error', `Failed to capture photo: ${errorDetail}`);
      }
    }
  };

  /**
   * Clears the currently selected receipt image.
   */
  const handleClearReceipt = () => {
    setExpenseForm(prev => ({ ...prev, receiptImage: '' }));
    setReceiptImagePreview(null);
    showMessage('info', 'Receipt photo cleared.');
  };

  /**
   * Handles clearing all logged trip and expense data.
   */
  const handleResetData = () => {
    // Require a second click to confirm data deletion
    if (message?.text.includes('again to confirm')) {
      setLogData([]);
      setActiveSection('viewLog'); // Stay on view log
      showMessage('success', 'All data cleared!');
    } else {
      showMessage('info', 'Press "Clear All Data" again to confirm.');
    }
  };

  /**
   * Exports log data to Excel file and triggers download
   */
  const handleExportCSV = async () => {
    if (logData.length === 0) {
      showMessage('error', 'No data to export.');
      return;
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Mileage & Expenses');

    // Add header row with styling
    worksheet.addRow(['Date', 'Type', 'Purpose', 'Description', 'Amount/Mileage', 'Receipt']);
    worksheet.getRow(1).font = { bold: true };

    // Set column widths
    worksheet.getColumn(1).width = 12; // Date
    worksheet.getColumn(2).width = 10; // Type
    worksheet.getColumn(3).width = 10; // Purpose
    worksheet.getColumn(4).width = 30; // Description
    worksheet.getColumn(5).width = 15; // Amount/Mileage
    worksheet.getColumn(6).width = 15; // Receipt

    // Add data rows
    let rowIndex = 2; // Start after header
    for (const entry of logData) {
      const date = entry.date;
      const type = entry.type;
      const purpose = entry.purpose;

      if (entry.type === 'trip') {
        // For trip entries
        const tripEntry = entry as Trip;
        const description = `${tripEntry.startLocation || ''} to ${tripEntry.endLocation || ''}`.trim();
        const mileage = tripEntry.mileage;
        worksheet.addRow([date, type, purpose, description, mileage, 'No']);
      } else {
        // For expense entries
        const expenseEntry = entry as Expense;
        const description = expenseEntry.description;
        const amount = expenseEntry.amount;

        // Add the row first
        worksheet.addRow([date, type, purpose, description, amount, expenseEntry.receiptImage ? 'See image' : 'No']);

        // If there's a receipt image, add it to the cell
        if (expenseEntry.receiptImage) {
          try {
            // Get the receipt cell - Removed unused variable warning
            // const receiptCell = worksheet.getCell(`F${rowIndex}`);

            // Add the image to the workbook
            const imageId = workbook.addImage({
              base64: expenseEntry.receiptImage,
              extension: 'jpeg',
            });

            // Add the image to the worksheet with larger dimensions
            worksheet.addImage(imageId, `F${rowIndex}:F${rowIndex + 2}`);

            // Increase row height to accommodate larger image
            worksheet.getRow(rowIndex).height = 120;
          } catch (error: unknown) { // Changed from any
            console.error('Error adding image to Excel:', error);
             let errorDetail = '';
             if (error instanceof Error) {
                 errorDetail = error.message;
             } else if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
                  errorDetail = (error as { message: string }).message;
             } else {
                 errorDetail = String(error); // Convert other types to string
             }
             showMessage('error', `Error adding image to Excel: ${errorDetail}`);
          }
        }
      }
      rowIndex++;
    }

    // Generate Excel file
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `mileage-expense-log-${new Date().toISOString().split('T')[0]}.xlsx`);
      showMessage('success', 'Excel file exported successfully!');
    } catch (error: unknown) { // Changed from any
      console.error('Error generating Excel file:', error);
       let errorDetail = '';
       if (error instanceof Error) {
           errorDetail = error.message;
       } else if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
            errorDetail = (error as { message: string }).message;
       } else {
           errorDetail = String(error); // Convert other types to string
       }
      showMessage('error', `Failed to generate Excel file: ${errorDetail}`);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px] bg-background text-foreground">
      <DefaultHeader />

      {/* Message/Toast Display */}
      {message && (
        <div
          className={`fixed top-[85px] left-1/2 -translate-x-1/2 p-3 rounded-lg z-50 text-center font-semibold shadow-lg w-11/12 max-w-md
            ${message.type === 'success' ? 'bg-green-600 text-white' : message.type === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}
        >
          <pre className="whitespace-pre-wrap font-sans text-left text-sm">{message.text}</pre>
        </div>
      )}

      <div className="flex-grow relative w-full overflow-y-auto p-4 pt-[calc(75px+10px)] pb-[75px]">
        {/* API Key Missing Alert */}
        {isApiKeyMissing && isMileageCalculationActive && ( // Only show if key is missing AND feature is active
             <div className="bg-destructive/20 border border-destructive text-destructive-foreground p-4 rounded-lg mb-6 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 mt-1 shrink-0" />
                <div>
                    <h3 className="font-bold">Configuration Error</h3>
                    <p className="text-sm">The Google Maps API Key is missing. Mileage calculation is disabled. Please set the <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> environment variable.</p>
                </div>
            </div>
        )}
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/Xpenselogo225.png"
            alt="Xpense Tracker Logo"
            data-ai-hint="logo expense money"
            width={225}
            height={100}
            style={{ width: '225px', height: 'auto' }}
            priority
            unoptimized={true}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/225x100.png?text=Xpense+Logo'; }} // Changed from any
          />
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="font-bold text-3xl text-foreground">Mileage &amp; Expense Tracker</span>
        </div>

        {/* Section Navigation Buttons */}
        <div className="flex justify-around mb-6 px-2">
          <Button onClick={() => setActiveSection('addTrip')} className={`w-1/3 py-2 text-sm font-semibold rounded-md ${activeSection === 'addTrip' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>Add Trip</Button>
          <Button onClick={() => setActiveSection('addExpense')} className={`w-1/3 py-2 text-sm font-semibold rounded-md mx-2 ${activeSection === 'addExpense' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>Add Expense</Button>
          <Button onClick={() => setActiveSection('viewLog')} className={`w-1/3 py-2 text-sm font-semibold rounded-md ${activeSection === 'viewLog' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>View Log</Button>
        </div>

        {/* Add New Trip Section */}
        {activeSection === 'addTrip' && (
          <div className="bg-card p-6 rounded-lg shadow-lg mb-4 border border-border">
            <h2 className="text-2xl font-bold mb-4 text-center text-card-foreground">Add New Trip</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="trip-date" className="block text-sm font-medium mb-1 text-muted-foreground">Date</label>
                <input type="date" id="trip-date" className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={tripForm.date} onChange={(e) => setTripForm({ ...tripForm, date: e.target.value })} />
              </div>
              <div>
                <label htmlFor="trip-purpose" className="block text-sm font-medium mb-1 text-muted-foreground">Purpose</label>
                <select id="trip-purpose" className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={tripForm.purpose} onChange={(e) => setTripForm({ ...tripForm, purpose: e.target.value as 'business' | 'personal' })}>
                  <option value="business">Business</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              <div className="bg-background p-3 rounded-md border border-border">
                <h3 className="text-md font-semibold mb-3 text-card-foreground">Mileage</h3>
                <p className="text-sm text-muted-foreground mb-2">Enter manually or calculate from locations.</p>
                <div>
                  <label htmlFor="trip-mileage" className="block text-sm font-medium mb-1 text-muted-foreground">Manual Mileage (miles)</label>
                  <input type="number" id="trip-mileage" className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g., 15.5" step="0.1" value={tripForm.mileage} onChange={(e) => setTripForm({ ...tripForm, mileage: e.target.value })} />
                </div>
                <p className="text-center text-muted-foreground my-4">- OR -</p>
                <div>
                  <label htmlFor="start-location" className="block text-sm font-medium mb-1 text-muted-foreground">Start Location</label>
                  <input type="text" id="start-location" className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-2" placeholder="e.g., 123 Main St, City" value={tripForm.startLocation} onChange={(e) => setTripForm({ ...tripForm, startLocation: e.target.value })} disabled={!isMileageCalculationActive} />
                  <label htmlFor="end-location" className="block text-sm font-medium mb-1 text-muted-foreground">End Location</label>
                  <input type="text" id="end-location" className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g., 456 Oak Ave, City" value={tripForm.endLocation} onChange={(e) => setTripForm({ ...tripForm, endLocation: e.target.value })} disabled={!isMileageCalculationActive} />
                  <Button onClick={handleCalculateMileage} disabled={!isMileageCalculationActive || isCalculatingMileage} className="mt-3 w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-2 rounded-md transition-colors shadow-md">
                    {isCalculatingMileage ? 'Calculating...' : 'Calculate Mileage'}
                  </Button>
                </div>
                {/* Deactivation Message - MOVED HERE */}
                {!isMileageCalculationActive && (
                    <div className="bg-blue-600/20 border border-blue-600 text-blue-600-foreground p-4 rounded-lg mt-4 flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 mt-1 shrink-0" />
                        <div>
                            <h3 className="font-bold">Feature Deactivated</h3>
                            <p className="text-sm">Mileage calculation is temporarily deactivated. You can still manually enter mileage.</p>
                        </div>
                    </div>
                )}
              </div>
              <div>
                <label htmlFor="trip-notes" className="block text-sm font-medium mb-1 text-muted-foreground">Notes (Optional)</label>
                <textarea id="trip-notes" className="w-full p-2 rounded-md bg-input border border-border text-foreground h-20 focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Any specific details about the trip..." value={tripForm.notes} onChange={(e) => setTripForm({ ...tripForm, notes: e.target.value })}></textarea>
              </div>
              <Button onClick={handleAddTrip} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-md text-lg transition-colors shadow-md mt-4">Add Trip</Button>
            </div>
          </div>
        )}

        {/* Add New Expense Section */}
        {activeSection === 'addExpense' && (
          <div className="bg-card p-6 rounded-lg shadow-lg mb-4 border border-border">
            <h2 className="text-2xl font-bold mb-4 text-center text-card-foreground">Add New Expense</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="expense-date" className="block text-sm font-medium mb-1 text-muted-foreground">Date</label>
                <input type="date" id="expense-date" className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} />
              </div>
              <div>
                <label htmlFor="expense-purpose" className="block text-sm font-medium mb-1 text-muted-foreground">Purpose</label>
                <select id="expense-purpose" className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={expenseForm.purpose} onChange={(e) => setExpenseForm({ ...expenseForm, purpose: e.target.value as 'business' | 'personal' })}>
                  <option value="business">Business</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              <div>
                <label htmlFor="expense-description" className="block text-sm font-medium mb-1 text-muted-foreground">Description</label>
                <input type="text" id="expense-description" className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g., Gas, Equipment, Food" value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} />
              </div>
              <div>
                <label htmlFor="expense-amount" className="block text-sm font-medium mb-1 text-muted-foreground">Amount ($)</label>
                <input type="number" id="expense-amount" className="w-full p-2 rounded-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g., 25.75" step="0.01" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} />
              </div>

              {/* Receipt Photo Section */}
              <div className="border border-border p-3 rounded-md bg-background">
                <h3 className="text-md font-semibold mb-3 text-card-foreground">Receipt Photo</h3>
                {receiptImagePreview ? (
                  <div className="relative w-full h-48 mb-3 rounded-md overflow-hidden border border-border">
                    <Image
                      src={receiptImagePreview}
                      alt="Receipt Preview"
                      layout="fill"
                      objectFit="contain"
                      className="rounded-md"
                    />
                    <Button
                      onClick={handleClearReceipt}
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full h-8 w-8"
                      aria-label="Clear receipt photo"
                    >
                      <XCircle className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleAddReceipt} className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-2 rounded-md transition-colors flex items-center justify-center space-x-2 shadow-md">
                    <CameraIcon className="h-5 w-5" />
                    <span>Add Receipt Photo</span>
                  </Button>
                )}
              </div>

              <Button onClick={handleAddExpense} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-md text-lg transition-colors shadow-md mt-4">Add Expense</Button>
            </div>
          </div>
        )}

        {/* View Log Section */}
        {activeSection === 'viewLog' && (
          <div className="bg-card p-6 rounded-lg shadow-lg mb-4 border border-border">
            <h2 className="text-2xl font-bold mb-4 text-center text-card-foreground">Trip &amp; Expense Log</h2>
            {logData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No trips or expenses logged yet.</p>
            ) : (
              <div className="space-y-4">
                {logData.map((entry) => (
                  <div key={entry.id} className="bg-background p-4 rounded-md border border-border/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-muted-foreground text-sm">{entry.date}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${entry.purpose === 'business' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                        {entry.purpose.toUpperCase()}
                      </span>
                    </div>
                    {entry.type === 'trip' ? (
                      <div>
                        <p className="text-lg font-semibold text-accent">Trip: {entry.mileage} miles</p>
                        {entry.startLocation && entry.endLocation && (<p className="text-sm text-muted-foreground">From: {entry.startLocation} To: {entry.endLocation}</p>)}
                        {entry.notes && <p className="text-sm text-muted-foreground mt-1">Notes: {entry.notes}</p>}
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-semibold text-accent">Expense: ${entry.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Description: {entry.description}</p>
                        {entry.receiptImage && (
                          <div className="mt-2 relative w-24 h-24 border border-border rounded-md overflow-hidden">
                            <Image
                              src={`data:image/jpeg;base64,${entry.receiptImage}`} // Display base64 image
                              alt="Receipt"
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {logData.length > 0 && (
              <div className="space-y-3 mt-6">
                <Button 
                  onClick={handleExportCSV} 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 rounded-md text-lg transition-colors shadow-md flex items-center justify-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Export to Excel</span>
                </Button>
                <Button 
                  onClick={handleResetData} 
                  className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold py-3 rounded-md text-lg transition-colors shadow-md"
                >
                  Clear All Data
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <NavbarTools />
    </div>
  );
}
