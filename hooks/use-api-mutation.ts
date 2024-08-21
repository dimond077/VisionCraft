import { useState } from "react";
import { useMutation } from "convex/react";

export const useApiMutation = (muatationFunction: any) => {
    const [pending, setPending] = useState(false);
    const apiMutaion = useMutation(muatationFunction);

    const mutate = (payload: any) => {
        setPending(true);
        return apiMutaion(payload)
            .finally(() => setPending(false))
            .then((result) => {
                return result;
            })
            .catch((error) => {
                throw error;
            });
    };
    return {
        mutate,
        pending,
    };
};