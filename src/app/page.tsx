// src/app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-primary/20 text-foreground">
      <header className="sticky top-0 z-40 w-full h-[75px] bg-background border-b-[3px] border-primary shadow-[0_4px_10px_4px_rgba(187,187,187,0)]">
        <div className="container mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/OX lett white175F.png"
              alt="OfficiaX Logo"
              data-ai-hint="logo company"
              height={40}
              width={140}
              style={{ width: "auto" }}
              priority
              unoptimized={true}
            />
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild className="text-foreground hover:bg-accent/10 hover:text-accent">
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16 sm:py-24 lg:py-32 text-center">

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to{' '}
            <span className="font-cinzel-decorative italic">
              <span className="text-white">Officia</span>
              <span className="text-primary">X</span>
            </span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl">
            The ultimate platform for sports officials. Integrate your schedule, access essential tools, instantly access your rulebooks, and leverage our custom AI for rule interpretations.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button asChild className="w-[150px] h-[50px] bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform border border-black">
              <Link href="/signup">
                Sign Up
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-[150px] h-[50px] text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-white">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<CalendarMonthOutlinedIcon sx={{ fontSize: '40px', color: 'hsl(var(--accent))', marginBottom: '1rem' }} />}
                title="Schedule Integration"
                description="Seamlessly sync your Google and Outlook calendars to manage game schedules effortlessly."
              />
              <FeatureCard
                icon={<ConstructionOutlinedIcon sx={{ fontSize: '40px', color: 'hsl(var(--accent))', marginBottom: '1rem' }} />}
                title="Official's Toolbox"
                description="Access weather updates, coin flip widget, umpire classroom, and a mileage/expense tracker all in one place."
              />
              <FeatureCard
                icon={<MenuBookOutlinedIcon sx={{ fontSize: '40px', color: 'hsl(var(--accent))', marginBottom: '1rem' }} />}
                title="Rulebooks"
                description="Instantly access official rulebooks for all the leagues you work, right when you need them."
              />
              <FeatureCard
                icon={<AutoAwesomeOutlinedIcon sx={{ fontSize: '40px', color: 'hsl(var(--accent))', marginBottom: '1rem' }} />}
                title="OfficiaX AI"
                description="Get instant, AI-powered assistance for all your rule interpretations and queries. This agent is specially trained on the rulebooks you use."
              />
            </div>
          </div>
        </section>

      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/50 bg-background">
        © {new Date().getFullYear()} OfficiaX LLC. <span className="italic">The Future of Officiating.</span>
        {/* Privacy Policy Link */}
        <div className="mt-2"> {/* Added margin-top for spacing */}
          <a
            href="https://www.officiax.com/privacy"
            target="_blank" // Opens in a new tab/window
            rel="noopener noreferrer" // Security best practice for target="_blank"
            className="text-primary hover:underline" // Styles the link
          >
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-start text-left bg-card p-6 rounded-xl shadow-lg hover:shadow-accent/20 transition-shadow duration-300 border border-primary">
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
