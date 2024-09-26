import axios from "axios";
import Cookies from "js-cookie";
import { API_DOMAIN, AUTH_DOMAIN } from "./constant/urls";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_DOMAIN(),
  withCredentials: true, // 쿠키 전송을 위한 설정
});

// 요청 인터셉터 - Access Token을 Authorization 헤더에 추가
apiClient.interceptors.request.use(
  async (config) => {
    let accessToken = Cookies.get("accessToken");

    // Access Token이 없거나 만료된 경우 처리
    if (!accessToken) {
      try {
        // Access Token 재발급 요청
        const { data } = await axios.post(
          "/api/v1/auth/refresh-token", // 토큰 재발급 엔드포인트
          {}, // 필요 시 request body 전달
          {
            baseURL: `${API_DOMAIN()}/auth/refresh-token`,
            withCredentials: true, // refreshToken이 HTTP-only 쿠키로 전송되도록 설정
          }
        );

        // 새로 발급된 Access Token 저장
        accessToken = data.accessToken;
        const accessTokenExpiresIn = data.accessTokenExpiresIn;
        
        if (accessToken) {
          Cookies.set("accessToken", accessToken, {
            expires: accessTokenExpiresIn / (60 * 60 * 24), // 만료 시간에 맞게 쿠키 설정
          });
        }
        
        // 요청에 새로 발급받은 Access Token 추가
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      } catch (error) {
        console.error("Token refresh failed:", error);
        return Promise.reject(error);
      }

    } else {
      // Access Token이 유효한 경우, 헤더에 추가
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - Access Token 만료 시, 토큰 재발급 // TODO: 아직 서버는 구현이 안되어있으므로, 형식상 넣어둠
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료로 인한 에러 발생 시 처리
    if (
      error.response &&
      error.response.status === 401 && // 401 Unauthorized
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 무한 루프 방지 플래그

      try {
        // Access Token 재발급 요청
        const { data } = await axios.post(
          '/auth/refresh-token',
          {},
          {
            baseURL: process.env.API_BASE_URL,
            withCredentials: true,
          }
        );

        // 새로 발급된 Access Token 저장
        const newAccessToken = data.accessToken;
        const accessTokenExpiresIn = data.accessTokenExpiresIn;

        Cookies.set("accessToken", newAccessToken, {
          expires: accessTokenExpiresIn / (60 * 60 * 24),
        });

        // 재시도하는 요청에 새 Access Token을 헤더에 추가
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // 재시도하는 요청 전송
        return apiClient(originalRequest);
      } catch (err) {
        // 토큰 재발급 실패 시 에러 처리
        console.error("Token refresh failed:", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;