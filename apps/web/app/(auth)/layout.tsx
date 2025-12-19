import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} font-sans min-h-screen bg-gray-50`}>
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-xl font-bold text-white">
              A29
            </div>
            <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
              Acts29 Ministry
            </h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
