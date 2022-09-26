import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBoxProps {
    children: string,
    lang?: string
}

export const CodeBox = (props: CodeBoxProps) => {
    dracula["pre[class*=\"language-\"]"]["borderRadius"] = "1em"
    dracula[":not(pre) > code[class*=\"language-\"]"]["borderRadius"] = "1em"
    return (<div>
        <SyntaxHighlighter language={props.lang} style={dracula}>
            {props.children}
        </SyntaxHighlighter>
    </div>)
}