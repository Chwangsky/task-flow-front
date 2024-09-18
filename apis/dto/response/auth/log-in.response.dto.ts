import ResponseDTO from "@/apis/dto/ResponseDTO";

export default interface LogInResponseDTO extends ResponseDTO {
    token: string;
    expirationTime: number;
}