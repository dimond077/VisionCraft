"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


interface NewBoardButtonProps {
    orgId: string;
    disabled?: boolean;
};


export const NewBoardButton = ({
    orgId,
    disabled,
}: NewBoardButtonProps) => {

    const { mutate, pending } = useApiMutation(api.board.create)
    const router = useRouter();

    const onClick = () => {
        mutate({
            orgId,
            title: "Not Titled yet"
        })
            .then((id) => {
                toast.success("Craft Created..😃")
                router.push(`/board/${id}`)
                // redirected to craft id 
            })
            .catch(() => toast.error("Failed to create a Craft"))
    }


    return (
        <button
            disabled={pending || disabled}
            onClick={onClick}
            className={cn("col-span-1 aspect-[100-127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
                (pending || disabled) && " opacity-75 hover:bg-blue-600 cursor-not-allowed"
            )}
        >
            <div />
            <Plus className="h-12 w-12 text-white stroke-1" />
            <p className=" text-sm text-white font-light ">
                New Craft
            </p>
        </button>
    );
};