import './globals.scss';
import type {Metadata} from 'next';
import {ReactNode} from 'react';
import {StoreProvider} from '@/store';
import localFont from 'next/font/local';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 500 700 900',
});

const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'A.I. Powered Calendar',
	description: 'Manage a calendar per prompt input.',
};

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} text-slate-950 bg-slate-50`}>
				<StoreProvider>
					{children}
				</StoreProvider>
			</body>
		</html>
	);
}
