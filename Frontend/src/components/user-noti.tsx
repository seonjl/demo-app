/**
 * v0 by Vercel.
 * @see https://v0.dev/t/mzZ7z0xhZAq
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";

export default function UserNotifi() {
  const userContext = useContext(UserContext);
  const email = userContext?.user?.email;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <UserIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Card className="shadow-none border-0">
          <CardHeader className="border-b">
            <CardTitle>{email}</CardTitle>
            <CardDescription>View your profile details.</CardDescription>
          </CardHeader>
          <CardContent className="p-6" />
        </Card>
      </PopoverContent>
    </Popover>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
