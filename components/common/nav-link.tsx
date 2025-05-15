'use client'
import Link from "next/link";
import { cn } from "@/lib/utils"; // Importing a utility function for conditional class names
import { usePathname } from "next/navigation";

export default function NavLink( {
    href,
    children, 
    className,
} : {
    href: string;
    children: React.ReactNode;
    className?: string;
    // The className prop is optional and can be used to pass additional CSS classes to the Link component.

}) {
const pathname = usePathname(); // Getting the current pathname from Next.js router
const isActive = pathname === href || (href !== '/' && pathname.startsWith(href)); // Checking if the current pathname matches the href or if the href is a prefix of the pathname

    return (
    <Link href={href} 
        className={cn("transition-colors text-sm duration-200 text-gray-600 hover:text-rose-500 ", className,
            isActive && 'text-rose-500'
        )}
    >
        {children}
    </Link>
    )
}
// This component is a simple wrapper around the Next.js Link component. It takes a href prop and children prop, 
// and renders a Link component with the given href and children. 
// This allows for easy navigation within the application while maintaining the benefits of client-side routing provided by Next.js.