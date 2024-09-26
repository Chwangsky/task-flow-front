import ResponseDTO from "@/apis/dto/ResponseDTO";

export default interface LogInResponseDTO extends ResponseDTO {
    accessToken: string;
    refreshToken: string;
    expirationTime: number;
}