import { ColorMode, TerminalOutput } from 'react-terminal-ui';
import TerminalUI from 'react-terminal-ui';
import { HTMLAttributes, useMemo } from 'react';
import AnsiUp from 'ansi_up';
import innerText from 'react-innertext';

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
                    <span dangerouslySetInnerHTML={{ __html: html }} />
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
