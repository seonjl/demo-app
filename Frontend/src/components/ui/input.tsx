import * as React from "react";

import { cn } from "@/lib/utils";

export interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  locked?: boolean;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, type, value, onChange, ...props }, ref) => {
    const [isEditing, setIsEditing] = React.useState(false);

    const handleFocus = () => {
      if (props.locked) return;
      setIsEditing(true);
    };

    const handleBlur = () => {
      setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;
      onChange(e.target.value as any);
    };

    return (
      <div className="p-2" onClick={handleFocus}>
        {isEditing ? (
          <input
            type={type}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            {...props}
          />
        ) : (
          <span className={cn("", className)}>{value}</span>
        )}
      </div>
    );
  }
);
CustomInput.displayName = "CustomInput";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const FileInput = () => {
  const inputEl = React.useRef(null);
  const [fileName, setFileName] = React.useState("");

  const handleFileChange = (event: any) => {
    setFileName(event.target.files[0]?.name || "");
  };

  return (
    <section className="flex flex-col items-center">
      <label htmlFor="file" className="flex flex-row items-center">
        <div className="pl-2 pr-4 py-2 text-white font-bold rounded-md cursor-pointer">
          <LinkIcon className="w-6 h-6 text-muted-foreground"></LinkIcon>
        </div>
        <p className="text-lg font-bold text-gray-600 truncate overflow-hidden w-9/12 whitespace-nowrap">
          {fileName}
        </p>
      </label>
      <input
        type="file"
        id="file"
        ref={inputEl}
        className="hidden"
        onChange={handleFileChange}
      />
    </section>
  );
};

export { CustomInput, FileInput, Input };

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
