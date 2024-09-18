"use client";

import InputBox from "@/components/views/InputBox";
import useLoginUserStore from "@/contexts/login-user.store";
import LogInRequestDTO from "@/apis/dto/request/auth/log-in.request.dto";
import LogInResponseDTO from "@/apis/dto/response/auth/log-in.response.dto";
import ResponseDTO from "@/apis/dto/ResponseDTO";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { MAIN_PATH } from "@/constant";
import { GOOGLE_SIGN_IN_URL } from "@/apis/constant/urls";

const LoginClient = ({ accessToken, refreshToken }) => {
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

  const router = useRouter();

  const logInResponse = (
    responseBody: LogInResponseDTO | ResponseDTO | null
  ) => {
    if (!responseBody) {
      alert("네트워크 이상입니다.");
      return;
    }

    const { code } = responseBody;
    if (code === "DBE") alert("데이터베이스 오류입니다.");
    if (code === "SF" || code === "VF") setError(true);
    if (code !== "SU") return;

    const { token, expirationTime } = responseBody as LogInResponseDTO;

    const now = new Date().getTime();
    const expires = new Date(now + expirationTime * 1000);

    // js-cookie를 이용해서 client-side cookies set
    Cookies.set("accessToken", token, { expires });
    Cookies.set("refreshToken", token, { expires });
    setLoginUser({
      email,
      nickname: "test",
      profileImage: null,
      isOAuth: false,
      userId: 0,
      isLogin: true,
    });
    router.push(MAIN_PATH());
  };

  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const { value } = event.target;
    setEmail(value);
  };

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const { value } = event.target;
    setPassword(value);
  };

  const onSignInButtonClickHandler = () => {
    const requestBody: LogInRequestDTO = { email, password };
    logInRequest(requestBody).then(logInResponse);
  };

  const onSignUpLinkClickhandler = () => {
    setView("sign-up"); // fix me
  };

  const onPasswordButtonClickHandler = () => {
    if (passwordType === "text") {
      setPasswordType("password");
      setPasswordButtonIcon("eye-light-off-icon");
    } else {
      setPasswordType("text");
      setPasswordButtonIcon("eye-light-on-icon");
    }
  };

  const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    if (!passwordRef.current) return;
    passwordRef.current.focus();
  };

  const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    onSignInButtonClickHandler();
  };

  const onGoogleSignInButtonClickHandler = () => {
    window.location.href = GOOGLE_SIGN_IN_URL();
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
