import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-900">
      <body className={`${inter.className} h-full`}>
        {/* Hero Section */}
        <div className="w-full bg-gray-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white mb-4">Mind Map Evaluation</h1>
            <p className="text-gray-300 text-lg">Analyze and evaluate mind maps with ease</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl bg-gray-800 mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8 rounded-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
