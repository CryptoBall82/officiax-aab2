"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface FieldStatus {
  id: string;
  name: string;
  status: string; // e.g., "Open", "Closed", "Caution", "Delayed"
  lastUpdated: string; // ISO date string
  notes?: string;
}

interface FieldStatusDisplayProps {
  dataSourceUrl: string;
  title: string;
  description: string;
}

const getStatusVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'default'; // Greenish in some themes, primary here
    case 'closed':
      return 'destructive';
    case 'caution':
      return 'secondary'; // Yellowish/Orange in some themes, greyish here
    case 'delayed':
      return 'outline'; // Bluish in some themes
    default:
      return 'secondary';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'closed':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'caution':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case 'delayed':
      return <Clock className="h-5 w-5 text-blue-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-500" />;
  }
};

export function FieldStatusDisplay({ dataSourceUrl, title, description }: FieldStatusDisplayProps) {
  const [fieldStatuses, setFieldStatuses] = useState<FieldStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFieldStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(dataSourceUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch field status: ${response.statusText}`);
        }
        const data: FieldStatus[] = await response.json();
        setFieldStatuses(data);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFieldStatus();
  }, [dataSourceUrl]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-1/4" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle /> Error Loading Field Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">Please try refreshing the page or check back later.</p>
        </CardContent>
      </Card>
    );
  }

  if (fieldStatuses.length === 0) {
     return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No field status information available at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {fieldStatuses.map((field) => (
        <Card key={field.id} className="shadow-md hover:shadow-lg transition-shadow bg-card/90">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{field.name}</CardTitle>
              <Badge variant={getStatusVariant(field.status)} className="ml-auto whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(field.status)}
                  {field.status}
                </div>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {field.notes && <p className="text-sm text-muted-foreground">{field.notes}</p>}
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Last updated: {formatDistanceToNow(parseISO(field.lastUpdated), { addSuffix: true })}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
