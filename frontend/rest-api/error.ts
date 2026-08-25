import axios, { AxiosError } from 'axios'

interface APIError {
    field: string;
    message: string;
}

interface APIErrorResponse {
    success: boolean;
    code: string;
    message: string;
    errors?: APIError[];
}

export const parseApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const err = error as AxiosError<APIErrorResponse>
        const data = err.response?.data

        if (data?.errors && data.errors.length > 0) {
            return data.errors
                .map((e) => `${e.field} ${e.message}`.toLowerCase())
                .join(', ')
        }

        if (data?.message) {
            return data.message
        }

        return err.message
    }

    if (error instanceof Error) {
        return error.message
    }

    return 'Something went wrong. Please try again.'
}