export default interface User {
    userId: number;
    email: string;
    nickname: string;
    isLogin: boolean;
    isOAuth: boolean;
    profileImage: string | null;
}