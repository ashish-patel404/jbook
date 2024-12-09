import { useState} from "react";
import { createRoot } from "react-dom/client";
import CodeEditor from './code-editor';
import Preview from './preview';
import bundle from '../bundler';

const CodeCell = () => {
    const [code, setCode] = useState('');
    const [input, setInput] = useState('');

    const onClick = async () => {
        const output = await bundle(input);
        setCode(output);
    };

    return (
        <div>
            <CodeEditor
                initialValue='const b=10;'
                onChange={(value) => setInput(value)}
            />

            <div style={{ paddingBottom: '5px' }}>
                <button onClick={onClick}>Submit</button>
            </div>

            <Preview code={code} />
        </div>
    );
};

export default CodeCell;