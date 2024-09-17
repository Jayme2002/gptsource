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
    variant?: "default" | "small";
}

const FreeCounter = ({ apiLimitCount, isPro = false, variant = "default" }: FreeCounterProps) => {
    const proModal = useProModal();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    if (isPro) return null;

    if (variant === "small") {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-xs text-slate-300/80 mb-1">
                    {apiLimitCount} / {MAX_FREE_COUNTS}
                </p>
                <Progress className="h-1 w-[80px] mb-1" value={(apiLimitCount / MAX_FREE_COUNTS) * 100} />
                <Button onClick={proModal.open} variant="outline" size="sm" className="text-xs px-2 py-1 h-7">
                    Upgrade <Crown fill="white" size={12} className="ml-1" />
                </Button>
            </div>
        );
    }

    return (
        <div>
            <CardContent className="p-3 pb-4 flex flex-col justify-center items-center space-y-4 border-0 border-t rounded-none">
                <div className="w-full">
                    <p className="text-center text-slate-300/80 text-sm mb-2">
                        {apiLimitCount} / {MAX_FREE_COUNTS} Free Generations
                    </p>
                    <Progress className="h-1.5" value={(apiLimitCount / MAX_FREE_COUNTS) * 100} />
                </div>
                <Button onClick={proModal.open} variant="outline" className="w-full">
                    Upgrade &nbsp; <Crown fill="white" size={16} />
                </Button>
            </CardContent>
        </div>
    );
};

export default FreeCounter;
