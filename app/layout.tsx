import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Providers } from '@/lib/redux/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Management Dashboard',
	description: 'A comprehensive management dashboard',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Providers>
					<div className='flex h-screen'>
						<Sidebar />
						<div className='flex-1 flex flex-col'>
							<Header />
							<main className='flex-1 overflow-y-auto bg-muted/10 p-6'>
								{children}
							</main>
							<Footer />
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
