import AnsiUp from 'ansi_up';
import { HTMLAttributes, useMemo } from 'react';
import innerText from 'react-innertext';
import TerminalUI, { ColorMode, TerminalOutput } from 'react-terminal-ui';

interface TerminalProps {
    children?: TerminalOutput[];
}

export const Terminal = ({ children }: TerminalProps & Omit<HTMLAttributes<any>, 'children'>) => {
    const memoizedLogs = useMemo(() => {
        return children?.map((log, index) => {
            const ansiIUp = new AnsiUp();
            const html = ansiIUp.ansi_to_html(innerText(log));
            console.log(html);

            return (
                <TerminalOutput key={index}>
                    <span dangerouslySetInnerHTML={{ __html: html }} className="whitespace-normal" />
                </TerminalOutput>
            );
        });
    }, [children]);

    return (
        <TerminalUI name="Terminal" colorMode={ColorMode.Dark}>
            {memoizedLogs}
        </TerminalUI>
    );
};
