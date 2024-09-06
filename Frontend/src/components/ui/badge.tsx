import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { UserCircle } from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export function UserBadge({ className, ...props }: BadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("flex items-center", className)}
      {...props}
    >
      {" "}
      <Avatar className="w-5 h-5">
        <AvatarImage src="/user.png" />
        <AvatarFallback>
          <UserCircle className="" />
        </AvatarFallback>
      </Avatar>
      <span className="ml-2">{props.children}</span>
    </Badge>
  );
}

export { Badge, badgeVariants };
