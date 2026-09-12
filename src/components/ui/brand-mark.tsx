import Image from "next/image";
import { cn } from "@/lib/utils";

export interface BrandMarkProps {
  size?: number;
  className?: string;
}

export function BrandMark({ size = 28, className }: BrandMarkProps) {
  return (
    <Image
      src="/nuetty-mark.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      sizes={`${size}px`}
      className={cn("shrink-0 rounded-md object-cover", className)}
    />
  );
}
