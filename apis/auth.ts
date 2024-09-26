import { sendRequest } from ".";
import LogInRequestDTO from "./dto/request/auth/log-in.request.dto";
import ResponseDTO from "./dto/ResponseDTO";

// 로그인 요청 함수
const loginRequest = async (requestBody: LogInRequestDTO): Promise<ResponseDTO | null> => {
  try {
    const response = await sendRequest<ResponseDTO>('POST', '/login', requestBody);
    return response;
  } catch (error) {
    console.error("Login request failed:", error);
    return null;
  }
};

export default loginRequest;
