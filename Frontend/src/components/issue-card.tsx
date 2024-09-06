import {
  useCreateIssue,
  useDeleteIssue,
  useSubscribeIssue,
  useUnsubscribeIssue,
  useUpdateIssue,
} from "@/api/useIssue";
import { Badge, UserBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { BellOffIcon, BellPlusIcon, LoaderCircle } from "lucide-react";
import React from "react";
import { CustomInput } from "./ui/input";

export function IssueCard({
  id,
  title = "Click to edit title",
  description = "Click to edit description",
  userEmail,
  subscribers,
  email,
  className,
}: {
  id?: string;
  title?: string;
  description?: string;
  userEmail?: string;
  subscribers?: string[];
  email?: string;
  className?: string;
}) {
  const queryClient = useQueryClient();
  const name = userEmail?.split("@")[0];
  const [_id, setId] = React.useState(id);
  const [_title, setTitle] = React.useState(title);
  const [_description, setDescription] = React.useState(description);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLocked, setIsLocked] = React.useState(false);

  const isSubscribed = subscribers?.includes(email || "");

  const cardRef = React.useRef<HTMLDivElement>(null);

  const {
    mutate: createIssue,
    isPending: isCreateIssuePending,
    isSuccess: isCreateIssueSuccess,
    isError: isCreateIssueError,
  } = useCreateIssue();

  const {
    mutate: putIssue,
    isPending: isPutIssuePending,
    isSuccess: isPutIssueSuccess,
    isError: isPutIssueError,
  } = useUpdateIssue();

  const {
    mutate: deleteIssue,
    isPending: isDeleteIssuePending,
    isSuccess: isDeleteIssueSuccess,
    isError: isDeleteIssueError,
  } = useDeleteIssue();

  const {
    mutate: subscribeIssue,
    isPending: isSubscribeIssuePending,
    isSuccess: isSubscribeIssueSuccess,
    isError: isSubscribeIssueError,
  } = useSubscribeIssue();

  const {
    mutate: unsubscribeIssue,
    isPending: isUnsubscribeIssuePending,
    isSuccess: isUnsubscribeIssueSuccess,
    isError: isUnsubscribeIssueError,
  } = useUnsubscribeIssue();

  const isCardLoading =
    isCreateIssuePending ||
    isDeleteIssuePending ||
    isPutIssuePending ||
    isSubscribeIssuePending ||
    isUnsubscribeIssuePending;

  const handleTitleChange = (e: React.SetStateAction<string>) => {
    if (isLocked) return;

    setTitle(e);
    setIsEditing(true);
  };
  const handleDescriptionChange = (e: React.SetStateAction<string>) => {
    if (isLocked) return;

    setDescription(e);
    setIsEditing(true);
  };
  const handleSubmit = () => {
    setIsEditing(false);

    if (!id) {
      createIssue(
        {
          createIssueRequest: { title: _title, description: _description },
        },
        {
          onSuccess: (data) => {
            queryClient.invalidateQueries({
              queryKey: ["listIssues"],
            });
          },
        }
      );
    } else {
      putIssue(
        {
          issueId: id!,
          updateIssueRequest: { title: _title, description: _description },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["listIssues"],
            });
          },
        }
      );
    }
  };

  const handleRemove = () => {
    deleteIssue(
      {
        issueId: id!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["listIssues"],
          });
        },
      }
    );
  };

  const handleSubscribe = () => {
    subscribeIssue(
      {
        issueId: id!,
        requestBody: {},
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["listIssues"],
          });
        },
      }
    );
  };

  const handleUnsubscribe = () => {
    unsubscribeIssue(
      {
        issueId: id!,
        requestBody: {},
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["listIssues"],
          });
        },
      }
    );
  };

  return (
    <div>
      <div
        className={cn(
          "p-4 m-4 rounded-lg shadow-md border border-muted-foreground max-w-lg",
          isLocked ? "bg-red-50" : "bg-lime-50",
          isCardLoading ? "opacity-50 pointer-events-none" : "",
          className
        )}
        aria-disabled
        ref={cardRef}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{id}</Badge>
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground"
            >
              Template
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {isCardLoading && (
              <LoaderCircle className="animate-spin items-center" />
            )}
            {isSubscribed ? (
              <BellOffIcon className="w-6 h-6" onClick={handleUnsubscribe} />
            ) : (
              <BellPlusIcon className="w-6 h-6" onClick={handleSubscribe} />
            )}

            {isLocked ? (
              <div className="flex items-center space-x-2">
                <LockIcon
                  className="w-6 h-6"
                  onClick={() => setIsLocked(!isLocked)}
                />
                <EmtpyIcon className="w-6 h-6 " onClick={handleRemove} />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <LockOpenIcon
                  className="w-6 h-6"
                  onClick={() => setIsLocked(!isLocked)}
                />

                <XIcon className="w-6 h-6 " onClick={handleRemove} />
              </div>
            )}
          </div>
        </div>
        <div className="mb-2">
          <CustomInput
            className="text-lg font-semibold"
            value={_title}
            onChange={handleTitleChange as any}
            locked={isLocked || undefined}
          />
          <CustomInput
            className="text-muted-foreground text-sm"
            value={_description}
            onChange={handleDescriptionChange as any}
            locked={isLocked || undefined}
          />
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant="default">Todo</Badge>
          <Badge variant="default">Medium</Badge>
          <UserBadge>{name}</UserBadge>
          <TriangleAlertIcon className="w-6 h-6 text-muted-foreground" />
          <CalendarIcon className="w-6 h-6 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">Cycle 50</span>
        </div>
        <div className="flex items-center justify-between space-x-2 h-10 w-full">
          {isEditing && (
            <div className="flex items-center justify-between space-x-2 h-10 w-full">
              <span></span>
              <Button
                variant="default"
                size="sm"
                disabled={!isEditing}
                onClick={handleSubmit}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function MoveHorizontalIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}

function TriangleAlertIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function EmtpyIcon(props: React.SVGProps<SVGSVGElement>) {
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
      visibility="hidden"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
  );
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function LockOpenIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}
