'use client';

import React, { useState, useEffect } from 'react';
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarLeagues } from '@/components/NavbarLeagues';
// import { useRouter } from 'next/navigation'; // Not used in this component for now

// Define TypeScript Interfaces - MODIFIED Park interface
interface Field {
    name: string;
    status: "Open" | "Closed" | "Unknown";
    updateTime: string;
    message?: string;
}

interface Park {
    name: string;
    address: string;
    source: string; // <<< ADDED THIS LINE to match your JSON
    overallStatus: "Open" | "Closed" | "Unknown";
    fields: Field[];
}

// Props for PageTitleBar
interface PageTitleBarProps {
    title: string;
}

// PageTitleBar Component - MODIFIED to accept a title prop
const PageTitleBar: React.FC<PageTitleBarProps> = ({ title }) => {
    return (
        <header className="bg-blue-600 text-white py-4 shadow-md h-[60px] flex items-center justify-center w-full">
            <h1 className="text-2xl font-bold text-center leading-[28px]">{title}</h1>
        </header>
    );
};

// Props for FieldStatusDisplay
interface FieldStatusDisplayProps {
    sourceFilter: string; // To filter which park system to show
    pageTitle: string;    // To set the title in PageTitleBar
}

// Main FieldStatusDisplay Component - MODIFIED to accept and use props
const FieldStatusDisplay: React.FC<FieldStatusDisplayProps> = ({ sourceFilter, pageTitle }) => {
    const [allParksData, setAllParksData] = useState<Park[]>([]); // Renamed from parksData
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // const router = useRouter(); // Not currently used

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://raw.githubusercontent.com/CryptoBall82/umpire-scraper/main/field_statuses.json');
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                const data: Park[] = await response.json();
                setAllParksData(data); // Store all fetched data
            } catch (e: unknown) {
                console.error("Fetch error:", e);
                let errorMessage = 'Failed to fetch field status data.';
                if (e instanceof Error) {
                    errorMessage = e.message;
                } else if (typeof e === 'object' && e !== null && 'message' in e && typeof (e as { message: unknown }).message === 'string') {
                     // Fallback for non-Error objects that might still have a message
                     errorMessage = (e as { message: string }).message;
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // MODIFIED: Filter the parks based on the sourceFilter prop
    const displayParks = allParksData.filter(park => park.source === sourceFilter);

    const getStatusColorClasses = (status: "Open" | "Closed" | "Unknown") => { // Renamed from getStatusColor for clarity
        switch (status) {
            case "Open": return "bg-green-100 text-green-700 border-green-500";
            case "Closed": return "bg-red-100 text-red-700 border-red-500";
            case "Unknown": return "bg-yellow-100 text-yellow-700 border-yellow-500";
            default: return "bg-gray-100 text-gray-700 border-gray-500";
        }
    };

    const statusMessageWrapperClass = "p-6 text-center text-gray-700 text-xl mt-4";

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <DefaultHeader />

            <div className="flex-grow w-full pt-[80px] pb-[60px] flex flex-col items-center">
                {/* MODIFIED: Pass the pageTitle prop to PageTitleBar */}
                <PageTitleBar title={pageTitle} />

                {loading && (
                    <div className={statusMessageWrapperClass}>Loading field statuses...</div>
                )}
                {error && (
                    <div className={`${statusMessageWrapperClass} bg-red-100 border border-red-400 text-red-700 rounded-lg`}>
                        Error loading data: {error}
                    </div>
                )}
                {/* MODIFIED: Update "no data" message to reflect filtering */}
                {!loading && !error && (!displayParks || displayParks.length === 0) && (
                    <div className={statusMessageWrapperClass}>
                        No field status data available for {pageTitle.replace('Statuses', '').trim()}.
                    </div>
                )}

                {!loading && !error && displayParks && displayParks.length > 0 && (
                    <main className="p-4 md:p-6 lg:p-8 w-full max-w-3xl">
                        <div className="space-y-6">
                            {displayParks.map((park) => ( // This now maps over the filtered 'displayParks'
                                <div key={park.name} className={`p-4 md:p-6 rounded-lg bg-white shadow-lg border-l-4 ${getStatusColorClasses(park.overallStatus).split(' ')[2]}`}>
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                                        <h2 className="text-2xl font-semibold text-blue-700">{park.name}</h2>
                                        <span className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-medium rounded-full ${getStatusColorClasses(park.overallStatus)}`}>
                                            Overall: {park.overallStatus}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{park.address}</p>
                                    <p className="text-xs text-gray-500 mb-4">
                                        Data source: {park.source} | Last Updated: {park.fields[0]?.updateTime || (park.source === "OceePark.com" && park.fields.every(f => f.updateTime === "N/A") ? "N/A" : "Not specified")}
                                    </p>

                                    {park.fields && park.fields.length > 0 && (
                                        <div className="mt-4 space-y-3">
                                            <h3 className="text-md font-semibold text-gray-800">Field Details:</h3>
                                            {park.fields.map((field, index) => (
                                                <div key={index} className={`p-3 rounded-md border ${getStatusColorClasses(field.status)}`}>
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-medium text-gray-800">{field.name}</p>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColorClasses(field.status)}`}>{field.status}</span>
                                                    </div>
                                                    {field.message && <p className="text-xs text-gray-600 mt-1"><em>Note: {field.message}</em></p>}
                                                    {(park.source !== "OceePark.com" || field.updateTime !== "N/A") && field.updateTime &&
                                                        <p className="text-xs text-gray-500 mt-1">Updated: {field.updateTime}</p>
                                                    }
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                     {(!park.fields || park.fields.length === 0) && (
                                        <p className="text-sm text-gray-500 mt-4">No individual field details available for this park.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </main>
                )}
            </div>
            <NavbarLeagues />
        </div>
    );
};

// Remove the simple App component if it's not your actual page structure.
// const App: React.FC = () => {
//     return (
//         <div className="App">
//             <FieldStatusDisplay sourceFilter="SOME_DEFAULT_FILTER_IF_NEEDED" pageTitle="Default Title" />
//         </div>
//     );
// };

// If this file IS your page (e.g., pages/ayba-status.tsx), then you'd structure it like this:
// (Assuming FieldStatusDisplay, PageTitleBar are defined above or imported)

/*
// EXAMPLE: How you would structure an actual page file, e.g., pages/ayba-status.tsx

import React from 'react'; // Already imported at the top
// ... other imports like DefaultHeader, NavbarLeagues if they are part of a layout ...
// ... Assume FieldStatusDisplay and PageTitleBar are defined in this file or imported from components ...

export default function AYBAStatusPageActual() {
  return (
    // FieldStatusDisplay already includes DefaultHeader, PageTitleBar, NavbarLeagues in its structure
    <FieldStatusDisplay
      sourceFilter="Alpharetta Youth Baseball (Blue Sombrero)"
      pageTitle="AYBA Field Statuses"
    />
  );
}
*/

// If FieldStatusDisplay is a reusable component (e.g. in 'components/FieldStatusDisplay.tsx')
// then this file would just export it:
export default function AYBAStatusPageActual() {
    return (
        <FieldStatusDisplay
        sourceFilter="Alpharetta Youth Baseball (Blue Sombrero)"
        pageTitle="AYBA Field Statuses"
      />
    )
}
