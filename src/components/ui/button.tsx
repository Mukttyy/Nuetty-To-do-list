import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 active:bg-black",
        secondary:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200/80 active:bg-zinc-200",
        outline:
          "border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300",
        ghost:
          "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200/60",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800",
        link: "text-blue-600 underline-offset-4 hover:underline p-0 h-auto",
        action:
          "text-blue-600 hover:bg-blue-50/80 active:bg-blue-100 font-medium",
      },
      size: {
        sm: "h-7 px-2.5 text-xs rounded-md gap-1.5",
        md: "h-9 px-3.5 text-sm rounded-lg gap-2",
        lg: "h-11 px-5 text-base rounded-lg gap-2.5",
        icon: "h-8 w-8 rounded-md p-0",
        iconSm: "h-6 w-6 rounded-md p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

