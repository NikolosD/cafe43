import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Menu App",
    description: "QR Menu Management",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
