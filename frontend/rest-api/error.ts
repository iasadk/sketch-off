import axios, { AxiosError } from 'axios'

type FastAPIErrorDetail = {
    msg: string
    loc?: (string | number)[]
    type?: string
}

type FastAPIErrorResponse = {
    detail?: string | FastAPIErrorDetail[]
}
export const parseApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const err = error as AxiosError<FastAPIErrorResponse>
        const detail = err.response?.data?.detail

        if (typeof detail === 'string') {
            return detail
        }

        if (Array.isArray(detail) && detail.length > 0) {
            return detail
                .map((d) => {
                    const field = d.loc?.[d.loc.length - 1]
                    return field ? `${field}: ${d.msg}` : d.msg
                })
                .join(', ')
        }

        return err.message
    }

    if (error instanceof Error) {
        return error.message
    }

    return 'Something went wrong. Please try again.'
}