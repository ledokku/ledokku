import Ansi from "ansi-to-react";
import { LoadingSection } from "./LoadingSection";
import { useEffect, useRef } from "react";

interface TerminalProps {
  logs?: string[];
  loading?: boolean;
  className?: string;
  scrollOnNew?: boolean;
}

export const Terminal = ({
  logs,
  loading,
  className,
  scrollOnNew = false,
}: TerminalProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && logs && logs.length > 0 && scrollOnNew) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [logs, ref, scrollOnNew]);

  return (
    <div
      ref={ref}
      className={`h-96 w-full flex flex-col bg-slate-900 rounded-lg py-4 px-6 text-white whitespace-pre-wrap overflow-hidden overflow-y-auto ${className}`}
    >
      {loading && <LoadingSection />}
      {logs && logs.map((log, index) => <Ansi key={index}>{log}</Ansi>)}
    </div>
  );
};
