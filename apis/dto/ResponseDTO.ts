import ResponseCode from "@/types/enum/response-code.enum";

export default interface ResponseDTO {
    code: ResponseCode;
    message: string;
}