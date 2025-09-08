"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm text-gray-600 mb-4">
      <ol className="flex space-x-2">
        <li>
          <Link href="/" className="hover:underline">Home</Link>
        </li>
        {parts.map((part, idx) => {
          const href = "/" + parts.slice(0, idx + 1).join("/");
          const label = part.charAt(0).toUpperCase() + part.slice(1);
          const isLast = idx === parts.length - 1;
          return (
            <li key={href} className="flex items-center">
              <span className="mx-1">&gt;</span>
              {isLast ? (
                <span className="font-medium">{label}</span>
              ) : (
                <Link href={href} className="hover:underline">{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
