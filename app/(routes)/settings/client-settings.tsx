'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Note: use 'next/navigation' instead of 'next/router'
import SubscriptionButton from "@/components/subscription-button";

const ClientSettings = ({ isPro }: { isPro: boolean }) => {
    const router = useRouter();

    useEffect(() => {
        const error = new URLSearchParams(window.location.search).get('error');
        if (error) {
            console.error('Error from Stripe:', error);
            // Display error to user
        }
    }, []);

    return (
        <>
            <p className="text-sm text-slate-300">
                {isPro
                    ? "Currently you are on the Pro plan."
                    : "Currently you are on the free plan."}
            </p>
            <SubscriptionButton isPro={isPro} />
        </>
    );
};

export default ClientSettings;
