"use client"; // Client component

import { useRouter } from "next/navigation";
import useLoginUserStore from "@/contexts/login-user.store"; // Custom store hook

const Header = () => {
  const { loginUser, resetLoginUser } = useLoginUserStore();
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignUpClick = () => {
    router.push("/signup");
  };

  return (
    <div className="bg-stone-600 min-w-max flex flex-row justify-center space-x-5">
      <div className="font-bold">TASK-FLOW</div>
      <button className="black-button" onClick={handleSignUpClick}>
        SIGN UP
      </button>
      <button className="white-button" onClick={handleLoginClick}>
        LOG IN
      </button>
    </div>
  );
};

export default Header;
