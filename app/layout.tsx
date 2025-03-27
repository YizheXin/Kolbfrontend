import { Inter } from 'next/font/google';
import './globals.css';
import { FileProvider } from '@/context/FileContext';
import { EvaluationProvider } from '@/context/EvaluationContext';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col bg-gray-900`}>
        {/* Hero Section */}
        <div className="w-full bg-gray-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white mb-4">KOLBS Evaluation</h1>
            <p className="text-gray-300 text-lg">Analyze and evaluate Kolbs reflection text</p>
          </div>
        </div>
      
        <FileProvider>
          <EvaluationProvider>
            {/* Main Content */}
            <main className="flex-1 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
              {children}
            </main>
          </EvaluationProvider>
        </FileProvider>


        {/* Footer */}
        <footer className="w-full py-4 bg-gray-800/50 backdrop-blur-sm mt-auto">
          <div className="text-center text-gray-400 text-sm">
            Powered by{' '}
            <span className="font-medium text-gray-300">AddAxis</span>
            <span className="mx-2">•</span>
            <span>© 2024</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
