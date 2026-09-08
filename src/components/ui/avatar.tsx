import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials?: string;
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, initials, name, src, size = "md", ...props }, ref) => {
    const computedInitials =
      initials ||
      (name
        ? name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "A");

    const sizeClasses = {
      sm: "h-5 w-5 text-[10px] rounded-[4px]",
      md: "h-6 w-6 text-xs rounded-[5px]",
      lg: "h-8 w-8 text-sm rounded-md",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold select-none bg-zinc-900 text-white shrink-0 shadow-sm",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name || "Avatar"}
            className="h-full w-full object-cover rounded-[inherit]"
          />
        ) : (
          <span>{computedInitials}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

