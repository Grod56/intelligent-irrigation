import type { Metadata } from "next";
import "../lib/styles/app-layouts/standard.scss";
import "../lib/styles/themes/quaint-navy.scss";
import Footer from "@/lib/components/footer/Footer";
import Header from "@/lib/components/header/Header";

export const metadata: Metadata = {
	title: "Intelligent Irrigation",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body suppressHydrationWarning>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
