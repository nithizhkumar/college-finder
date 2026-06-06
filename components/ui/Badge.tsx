import { cn } from "@/lib/utils";

type Variant = "blue" | "orange" | "purple" | "green" | "gray" | "red";

const variantClasses: Record<Variant, string> = {
  blue:   "bg-blue-100 text-blue-800",
  orange: "bg-orange-100 text-orange-800",
  purple: "bg-purple-100 text-purple-800",
  green:  "bg-green-100 text-green-800",
  gray:   "bg-gray-100 text-gray-700",
  red:    "bg-red-100 text-red-800",
};

export function Badge({
  children,
  variant = "gray",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
