import { BellNotifi } from "@/components/bell-noti";
import { Toaster } from "@/components/ui/toaster";
import UserNotifi from "@/components/user-noti";
import { UserContext } from "@/context/UserContext";
import { useContext, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface TopNavLayoutProps {
  children: ReactNode;
}

interface MainLayoutProps {
  children: ReactNode;
}

export function TopNavLayout({ children }: TopNavLayoutProps) {
  return (
    <div className="flex flex-col">
      <TopNavigation />
      <div className="gap-4 pt-10 px-20 pb-bottom-nav">{children}</div>
    </div>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex">
      <LeftSideNavigation />
      <div className="flex-1 flex flex-col">
        <TopNavigation />
        <main className="flex-1 p-10">{children}</main>
        <Toaster />
      </div>
    </div>
  );
}

type Props = {
  title: string;
  url: string;
};

export function NavButton({ title, url }: Props) {
  return (
    <Link to={`${url}`} className="transition duration-150 hover:text-gray-300">
      {title}
    </Link>
  );
}

export function TopNavigation() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const userContext = useContext(UserContext);
  const email = userContext?.user?.email;

  return (
    <header className="flex items-center py-4 shadow-md px-20">
      <p className="ml-2 font-bold text-xl">
        <NavButton url="/issues" title="TMS" />
      </p>
      <div className="ml-10 flex gap-6 font-semibold">
        <NavButton url="/issues" title="issue" />
        <NavButton url="/files" title="file" />
        <NavButton url="/channels" title="channel" />
        <NavButton url="/messages" title="message" />
      </div>
      <div className="flex ml-auto items-center">
        {email ? (
          <div className="flex">
            <div className="fixed top-4 right-4 flex items-center gap-2">
              <p className="flex px-2 items-center font-light text-sm select-none">
                {userContext?.user?.email}
              </p>
              {/* <ChatNotifi /> */}
              <BellNotifi />
              <UserNotifi />
            </div>
          </div>
        ) : (
          <NavButton url="/login" title="login" />
        )}
        <div
          className={
            isOpen
              ? "absolute top-[56px] right-[80px] w-[200px] border rounded-lg text-black text-sm px-4 py-2 hover:bg-slate-50 cursor-pointer z-100 bg-[#fcfcfc]"
              : "hidden"
          }
        >
          Logout2
        </div>
      </div>
    </header>
  );
}

export function LeftSideNavigation() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const userContext = useContext(UserContext);
  const email = userContext?.user?.email;

  return (
    <nav className="flex flex-col w-32 min-h-screen p-4 shadow-md">
      <p className="mb-6 font-bold text-xl">제목</p>
      <div className="flex flex-col gap-4 font-semibold">
        <NavButton url="/issues" title="issue" />
        <NavButton url="/files" title="file" />
        <NavButton url="/channels" title="channel" />
        <NavButton url="/messages" title="message" />
      </div>
    </nav>
  );
}
