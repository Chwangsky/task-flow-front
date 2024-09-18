// app/login/page.tsx

import { cookies } from "next/headers";
import LoginClient from "./components/LoginClient";

// This is a Server Component
const LoginPage = () => {
  // Retrieve cookies server-side
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  // Pass cookies as props to the Client Component

  return (
    <>
      <LoginClient accessToken={accessToken} refreshToken={refreshToken} />
    </>
  );
};

export default LoginPage;
