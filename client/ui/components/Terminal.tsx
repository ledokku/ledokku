import AnsiUp from 'ansi_up';
import { HTMLAttributes, useMemo } from 'react';
import innerText from 'react-innertext';
import TerminalUI, { ColorMode, TerminalOutput } from 'react-terminal-ui';
import { LoadingSection } from './LoadingSection';

interface TerminalProps {
    children?: TerminalOutput[];
    loading?: boolean;
}

export const Terminal = ({ children, loading }: TerminalProps & Omit<HTMLAttributes<any>, 'children'>) => {
    const memoizedLogs = useMemo(() => {
        return children?.map((log, index) => {
            const ansiIUp = new AnsiUp();
            const html = ansiIUp.ansi_to_html(innerText(log));

            return (
                <TerminalOutput key={index}>
                    <span dangerouslySetInnerHTML={{ __html: html }} className="whitespace-pre-wrap" />
                </TerminalOutput>
            );
        });
    }, [children]);

    return (
        <TerminalUI name="Terminal" colorMode={ColorMode.Dark}>
            {loading ? <LoadingSection type='points-opacity' /> : memoizedLogs}
        </TerminalUI>
    );
};
