import { RegisterFormData } from "../api/auth/auth";

type RegisterApiDTO = {
    user: {
        email: string,
        password: string,
    },
    profile: {
        full_name: string,
        nickname: string
    }
}

const registerDTO = (data: RegisterFormData): RegisterApiDTO => {
    return {
        user: data.user,
        profile: {
            full_name: data.profile.fullname,
            nickname: data.profile.nickname
        }
    }
}

export {
    registerDTO,
    type RegisterApiDTO
}