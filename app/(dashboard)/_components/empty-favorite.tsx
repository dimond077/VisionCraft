import Image from "next/image";

export const EmptyFavorite = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/empty-favorites.svg"
                alt="Empty"
                height={140}
                width={140}
            />
            <h2 className="text-2xl font-semibold mt-6">
                No Favorites Craft
            </h2>
            <p className="text-muted-foreground textg-sm mt-2">
                Try Favorite Craft
            </p>
        </div>
    );
};