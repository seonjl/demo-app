import { authApiClient } from "@/api/useClient";
import { UserContext } from "@/context/UserContext";
import { setAccessToken } from "@/lib/utils";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function InRedirectGoogle() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const userContext = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    authApiClient
      .googleAuthorize({
        googleAuthorizeRequest: {
          code: code!,
        },
      })
      .then((response) => {
        if (response.accessToken) {
          setAccessToken(response.accessToken);
          navigate("/issues");
          userContext?.setUser({
            email: response.email!,
          });
        }
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <MountainIcon />
    </div>
  );
}
function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
