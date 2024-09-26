"use client";

import InputBox from "@/components/views/InputBox";
import useLoginUserStore from "@/contexts/login-user.store";
import LogInRequestDTO from "@/apis/dto/request/auth/log-in.request.dto";
import LogInResponseDTO from "@/apis/dto/response/auth/log-in.response.dto";
import ResponseDTO from "@/apis/dto/ResponseDTO";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { MAIN_PATH } from "@/constant";
import { GOOGLE_SIGN_IN_URL } from "@/apis/constant/urls";
import loginRequest from "@/apis/auth";

const LoginClient = () => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordType, setPasswordType] = useState<"text" | "password">(
    "password"
  );
  const [passwordButtonIcon, setPasswordButtonIcon] = useState<
    "eye-light-off-icon" | "eye-light-on-icon"
  >("eye-light-on-icon");
  const [error, setError] = useState<boolean>(false);

  const { setLoginUser, resetLoginUser } = useLoginUserStore();

  const logInResponse = (
    responseBody: LogInResponseDTO | ResponseDTO | null
  ) => {
    if (!responseBody) {
      alert("네트워크 이상입니다.");
      return;
    }

    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    else if (code === "SF" || code === "VF") setError(true);
    else if (code === "SU") {
      const { accessToken, refreshToken, expirationTime } =
        responseBody as LogInResponseDTO;

      const now = new Date().getTime();
      const expires = new Date(now + expirationTime * 1000);

      // Use js-cookie to set client-side cookies
      Cookies.set("accessToken", accessToken, { expires, secure: true });
      Cookies.set("refreshToken", refreshToken, { expires, secure: true });

      setLoginUser({
        email,
        nickname: "test",
        profileImage: null,
        isOAuth: false,
        userId: 0,
        isLogin: true,
      });

      router.push(MAIN_PATH());
    } else {
      alert("알 수 없는 오류가 발생했습니다.");
    }
  };

  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setEmail(event.target.value);
  };

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setPassword(event.target.value);
  };

  const onSignInButtonClickHandler = () => {
    const requestBody: LogInRequestDTO = { email, password };
    loginRequest(requestBody).then(logInResponse);
  };

  const onPasswordButtonClickHandler = () => {
    setPasswordType((prevType) => (prevType === "text" ? "password" : "text"));
    setPasswordButtonIcon((prevIcon) =>
      prevIcon === "eye-light-on-icon"
        ? "eye-light-off-icon"
        : "eye-light-on-icon"
    );
  };

  const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") passwordRef.current?.focus();
  };

  const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") onSignInButtonClickHandler();
  };

  const onGoogleSignInButtonClickHandler = () => {
    const googleSignInUrl = GOOGLE_SIGN_IN_URL();
    if (googleSignInUrl) window.location.href = googleSignInUrl;
    else alert("Google Sign-In URL이 유효하지 않습니다.");
  };

  const onSignUpLinkClickhandler = () => {
    router.push("/signup");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/image/auth-background.png')" }}
    >
      <div className="w-[1200px] grid grid-cols-[2fr,5fr] gap-[78px]">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-[20px]">
            <div
              className="w-[50px] h-[50px] bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/assets/image/auth-logo.png')" }}
            />
            <div className="flex flex-col items-center gap-[12px]">
              <div className="text-white text-[40px] font-normal leading-[140%] tracking-[-1.2px]">
                {"로그인"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[10px] p-[50px] shadow-[0px_4px_47px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-[40px] mb-[100px]">
            <div className="flex justify-between">
              <div className="text-[24px] font-semibold">{"로그인"}</div>
            </div>
            <InputBox
              ref={emailRef}
              label="이메일 주소"
              type="text"
              placeholder="이메일 주소를 입력해주세요."
              error={error}
              value={email}
              onChange={onEmailChangeHandler}
              onKeyDown={onEmailKeyDownHandler}
            />
            <InputBox
              ref={passwordRef}
              label="패스워드"
              type={passwordType}
              placeholder="비밀번호를 입력해 주세요."
              error={error}
              value={password}
              onChange={onPasswordChangeHandler}
              onKeyDown={onPasswordKeyDownHandler}
              icon={passwordButtonIcon}
              onButtonClick={onPasswordButtonClickHandler}
            />
          </div>

          <div className="flex flex-col items-center gap-[20px]">
            {error && (
              <div className="text-red-500 text-[12px] leading-[140%]">
                {
                  "이메일 주소 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요."
                }
              </div>
            )}
            <button
              className="w-full bg-black text-white py-3 text-[24px] font-semibold"
              onClick={onSignInButtonClickHandler}
            >
              {"로그인"}
            </button>
            <div className="text-center text-[14px] text-black/70 font-medium">
              {"신규 사용자이신가요?"}
              <span
                className="ml-2 text-black cursor-pointer"
                onClick={onSignUpLinkClickhandler}
              >
                {"회원가입"}
              </span>
            </div>
          </div>

          <div className="mt-[30px] flex justify-evenly">
            <button
              className="w-[40px] h-[40px] bg-cover"
              style={{
                backgroundImage: "url('/assets/image/google-icon.png')",
              }}
              onClick={onGoogleSignInButtonClickHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginClient;
