"use client";

import InputBox from "@/components/views/InputBox";
import { ChangeEvent, useState } from "react";

const Login = () => {
  const [input, setInput] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div>
      <div>Login in to Task Flow</div>
      <InputBox
        label="라벨"
        placeholder="플레이스홀더"
        type="text"
        value="value"
        onChange={handleChange}
        error={false}
      />
    </div>
  );
};

export default Login;
