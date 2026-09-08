import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-[#18181B] text-white shadow-xs hover:bg-[#27272A] active:bg-black",
        secondary:
          "bg-[#F4F5F7] text-[#18181B] hover:bg-[#EAECEE] active:bg-[#E4E7EB]",
        outline:
          "border border-[#E5E7EB] bg-white text-[#18181B] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]",
        ghost:
          "text-[#71717A] hover:bg-[#F4F5F7] hover:text-[#18181B] active:bg-[#ECEEF1]",
        action:
          "text-[#2563EB] hover:bg-blue-50/70 active:bg-blue-100/80 font-medium",
        destructive:
          "bg-[#EF4444] text-white shadow-xs hover:bg-red-600 active:bg-red-700",
        destructiveGhost:
          "text-[#EF4444] hover:bg-red-50 hover:text-red-700 active:bg-red-100",
        link: "text-[#2563EB] underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        xs: "h-6 px-2 text-[11px] rounded gap-1",
        sm: "h-7 px-2.5 text-xs rounded-md gap-1.5",
        md: "h-9 px-3.5 text-sm rounded-lg gap-2",
        lg: "h-11 px-5 text-base rounded-lg gap-2.5",
        iconXs: "h-6 w-6 rounded p-0",
        iconSm: "h-7 w-7 rounded-md p-0",
        iconMd: "h-9 w-9 rounded-lg p-0",
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
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
