import { Result, getGenericPassword, resetGenericPassword, setGenericPassword } from "react-native-keychain";

type Tokens = {
    accessToken: string,
    refreshToken: string
}

enum JwtCause {
    ACCESS_TOKEN_EXPIRED = "ACCESS_TOKEN_EXPIRED",
    REFRESH_TOKEN_EXPIRED = "REFRESH_TOKEN_EXPIRED",
    INVALID_TOKEN = "INVALID_TOKEN",
    TOKEN_FAILED = "TOKEN_FAILED",
    NEEDS_FRESH_TOKEN = "NEEDS_FRESH_TOKEN",
    MISSING_TOKEN = "MISSING_TOKEN",
    REVOKED_TOKEN = "REVOKED_TOKEN",
}

const getLocalTokens = async (): Promise<Tokens|undefined> => {
    const tokens = await getGenericPassword();

    if (tokens) {
        const { accessToken, refreshToken } = JSON.parse(tokens.password);

        return {
            accessToken,
            refreshToken
        }
    }
}

const setLocalTokens = async (tokens: Tokens): Promise<false|Result> => {
    return await setGenericPassword("tokens", JSON.stringify({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    }));
}

const resetLocalTokens = async (): Promise<boolean> => {
    return await resetGenericPassword();
}

export {
    getLocalTokens,
    setLocalTokens,
    resetLocalTokens,
    JwtCause,
    type Tokens,
}