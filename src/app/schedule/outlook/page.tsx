// src/app/schedule/outlook/page.tsx
// src/app/schedule/outlook/page.tsx
'use client';

import React from 'react';
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarSchedule } from '@/components/NavbarSchedule';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OutlookPage() {
  const openOutlook = () => {
    window.open('https://outlook.live.com/calendar/0/view/month', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px] bg-background">
      <DefaultHeader />
      <main className="flex-grow w-full flex flex-col items-center justify-center p-4 pt-[90px] pb-[90px]">
        <Card className="w-full max-w-md bg-card shadow-xl">
          <CardHeader className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <CardTitle className="text-2xl font-bold text-foreground">Embedding Not Supported</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Due to Microsoft&apos;s security policies, Outlook Calendar cannot be displayed directly within the app.
            </p>
            <p className="text-muted-foreground">
              You can open your calendar in a new browser tab instead.
            </p>
            <Button onClick={openOutlook} className="w-full max-w-xs bg-[#0078D4] hover:bg-[#005a9e] text-white font-semibold py-3 text-base">
              Open Outlook Calendar
            </Button>
          </CardContent>
        </Card>
      </main>
      <NavbarSchedule />
    </div>
  );
}

