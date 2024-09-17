import { useEffect, useState } from "react";
import { CardContent } from "./ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Crown } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";

interface FreeCounterProps {
    apiLimitCount: number;
    isPro: boolean;
    variant?: "default" | "small";  // Add this line
}
const FreeCounter = ({ apiLimitCount, isPro = false, variant = "default" }: FreeCounterProps) => {
    const proModal = useProModal();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    if (isPro) return null;

    return (
        <div className={variant === "small" ? "text-center" : ""}>
            <CardContent className={`p-0 ${variant === "small" ? "py-1" : "pb-3"} flex flex-col justify-center items-center space-y-2 border-0 rounded-none ${variant === "small" ? "min-h-0" : "min-h-[7.4rem]"}`}>
                <div className="w-full">
                    <p className={`text-center text-slate-300/80 ${variant === "small" ? "text-xs" : "text-sm"} mb-1`}>
                        {apiLimitCount} / {MAX_FREE_COUNTS}
                    </p>
                    <Progress className="h-1.5" value={(apiLimitCount / MAX_FREE_COUNTS) * 100} />
                </div>
                {variant === "default" && (
                    <Button onClick={proModal.open} variant="outline" className="w-full">
                        Upgrade &nbsp; <Crown fill="white" size={16} />
                    </Button>
                )}
            </CardContent>
        </div>
    );
};

export default FreeCounter;
