import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import ResponseDTO from "./dto/ResponseDTO";
import { API_DOMAIN } from "./constant/urls";

// Axios 인스턴스 생성
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_DOMAIN,
});

// 요청 인터셉터 설정 (토큰이 필요하면 헤더에 추가)
apiClient.interceptors.request.use(
  (config) => {
    // 필요한 경우 토큰 추가 로직
    return config;
  },
  (error) => Promise.reject(error)
);

// 공통 API 요청 함수
export const sendRequest = async <T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  accessToken?: string
): Promise<T | ResponseDTO | null> => {
  const config: AxiosRequestConfig = {
    method,
    url,
    data,
    headers: {},
  };

  if (accessToken) {
    config.headers = config.headers || {};  // headers가 null이면 빈 객체로 초기화
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await apiClient.request(config);
    return response.data as T;
  } catch (error: any) {
    if (!error.response) return null;
    return error.response.data as ResponseDTO;
  }
};