import { useState, useEffect } from "react";
import { Clock, Ticket } from "lucide-react";

interface QueueTokenProps {
    token: string;
    waitTime: string; // e.g., "10-15 mins"
}

const QueueToken = ({ token, waitTime }: QueueTokenProps) => {
    // Generate an initial random remaining time between 10 and 15 mins (in seconds)
    const [timeLeft, setTimeLeft] = useState(() => Math.floor(Math.random() * 300) + 600);
    const [queuePos, setQueuePos] = useState(() => Math.floor(Math.random() * 5) + 3);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // Every 30 seconds randomly decrease queue position
        const queueTimer = setInterval(() => {
            setQueuePos((prev) => (prev > 1 ? prev - 1 : 1));
        }, 30000);

        return () => {
            clearInterval(timer);
            clearInterval(queueTimer);
        };
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="rounded-xl border border-secondary/20 bg-card p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full -z-10" />
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Your Token</h3>
                    <div className="mt-2 text-4xl font-black text-secondary tracking-wider">{token}</div>
                </div>
                <div className="rounded-full bg-secondary/10 p-3 shadow-inner">
                    <Ticket className="h-6 w-6 text-secondary" />
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm bg-muted/50 p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-kiosk-teal" />
                        <span>Live Wait Time:</span>
                    </div>
                    <span className="font-bold text-foreground text-lg tracking-wide">
                        {minutes}:{seconds.toString().padStart(2, "0")} <span className="text-xs font-normal text-muted-foreground">min</span>
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm px-1">
                    <span className="text-muted-foreground">People ahead of you:</span>
                    <span className="font-bold text-lg text-primary">{queuePos}</span>
                </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-kiosk-green animate-pulse" />
                Please wait for your number to be called on the screen
            </div>
        </div>
    );
};

export default QueueToken;
