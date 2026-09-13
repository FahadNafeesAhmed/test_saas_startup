import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';

// Safe wrappers that return null if the DB is unavailable (e.g. during Vercel build)
async function safeGetUser() {
  try {
    const { getUser } = await import('@/lib/db/queries');
    return await getUser();
  } catch {
    return null;
  }
}

async function safeGetTeam() {
  try {
    const { getTeamForUser } = await import('@/lib/db/queries');
    return await getTeamForUser();
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: 'Next.js SaaS Starter',
  description: 'Get started quickly with Next.js, Postgres, and Stripe.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        <SWRConfig
          value={{
            fallback: {
              // We do NOT await here
              // Only components that read this data will suspend
              '/api/user': safeGetUser(),
              '/api/team': safeGetTeam()
            }
          }}
        >
          {children}
        </SWRConfig>
      </body>
    </html>
  );
}

