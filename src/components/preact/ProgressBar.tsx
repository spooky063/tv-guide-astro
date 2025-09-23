import { useEffect, useState, useRef } from "preact/hooks";

import { parseDate } from '../../utils.ts';
import { TZDate } from "@date-fns/tz";

interface ProgressBarGroupProps {
    dateEndpoint: { startDate: string; endDate: string; };
    programDate: { startDate: string; endDate: string; }[];
    currentDate?: string; // for testing purposes
}

interface ProgressBarProps {
    startDate: string;
    endDate: string;
    currentDate?: string; // for testing purposes
}

interface DotProps {
    active: boolean;
}

export function ProgressBarGroup({ dateEndpoint, programDate, currentDate }: ProgressBarGroupProps) {
    if (dateEndpoint.startDate === undefined || dateEndpoint.endDate === undefined) {
        console.error('dateEndpoint is undefined');
        return;
    }

    const startDate = new TZDate(parseDate(dateEndpoint.startDate), "Europe/Paris");
    const endDate = new TZDate(parseDate(dateEndpoint.endDate), "Europe/Paris");
    const nowDate = currentDate ? parseDate(currentDate) : new TZDate(Date.now(), "Europe/Paris");

    if (startDate > nowDate || endDate < nowDate) {
        return;
    }

    return (
        <div class="flex items-center gap-0.5 mt-1.5">
            {programDate.map(({ startDate, endDate }) => {
                const start = new TZDate(parseDate(startDate), "Europe/Paris");
                const end = new TZDate(parseDate(endDate), "Europe/Paris");

                if (start > nowDate) {
                    return <Dot active={false} />;
                }
                if (nowDate > end) {
                    return <Dot active={true} />;
                }

                return <ProgressBar startDate={startDate} endDate={endDate} currentDate={currentDate} />;
            })}
        </div>
    );
}

export function ProgressBar({ startDate , endDate, currentDate }: ProgressBarProps) {
    const [progress, setProgress] = useState(0);
    const rafRef = useRef(null);

    const start = new TZDate(parseDate(startDate), "Europe/Paris");
    const end = new TZDate(parseDate(endDate), "Europe/Paris");

    useEffect(() => {
        const update = () => {
            const now = currentDate ? parseDate(currentDate) : new TZDate(Date.now(), "Europe/Paris");

            const percent = ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;
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
            <div class="flex-1 bg-bg-neutral-muted rounded h-1">
                <div
                    class="h-1 bg-fg-accent rounded transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        ) : null
    );
}

export function Dot({ active }: DotProps) {
    let classes = "flex w-1 h-1 rounded-full ";
    classes += active ? "bg-fg-accent" : "bg-bg-neutral-muted";

    return (
        <div class={classes}></div>
    );
}