import { useEffect, useState, useRef } from "preact/hooks";

interface ProgressBarProps {
    startDate: string;
    endDate: string;
    currentDate?: string; // for testing purposes
}

export default function ProgressBar({ startDate , endDate, currentDate }: ProgressBarProps) {
    const [progress, setProgress] = useState(0);
    const rafRef = useRef(null);

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (!start || !end || isNaN(start) || isNaN(end) || end <= start) {
            return;
        }

    useEffect(() => {
        const update = () => {
            const now = currentDate ? new Date(currentDate).getTime() : Date.now();

            const offsetMinutes = Math.abs(new Date().getTimezoneOffset());
            const offsetMilliSeconds = offsetMinutes * 60 * 1000;
            const nowCorrected = now + offsetMilliSeconds;

            const percent = ((nowCorrected - start) / (end - start)) * 100;
            setProgress(Math.max(0, Math.min(100, Number(percent.toFixed(2)))));

            rafRef.current = requestAnimationFrame(update);
        };

        rafRef.current = requestAnimationFrame(update);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [startDate, endDate]);

    return (
        progress > 0 && progress < 100 ? (
            <div class="w-full bg-bg-neutral-muted rounded h-1 mt-1.5">
                <div
                    class="h-1 bg-fg-accent rounded transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        ) : null
    );
}
