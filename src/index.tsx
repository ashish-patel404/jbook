import 'bulmaswatch/superhero/bulmaswatch.min.css';
import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/code-editor';

const container = document.getElementById('root');
const root = createRoot(container!);

const App = () => {
    const ref = useRef<esbuild.Service>();
    const iframe = useRef<any>();
    const [input, setInput] = useState('');
    //const [code, setCode] = useState('');

    const startService = async () => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm'
        });
    };

    useEffect(() => {
        startService();
    }, []);


    const onClick = async () => {
        if (!ref.current) {
            return;
        }

        iframe.current.srcdoc = html;

        // const result = await ref.current.transform(input, {
        //     loader: 'jsx',
        //     target: 'es2015'
        // });

        const result = await ref.current.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [
                unpkgPathPlugin(),
                fetchPlugin(input)
            ],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window',
            }
        });

        //console.log(result);
        // setCode(result.outputFiles[0].text);
        iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');

        // try {
        //     eval(result.outputFiles[0].text);
        // } catch (err) {
        //     alert(err);
        // }

    };

    const html = `
        <html>
            <head></head>
            <body>
                <div id="root"></div>
                <script>
                    window.addEventListener('message', (event) => {
                        try {
                            eval(event.data);
                            }
                        catch (err) {
                            const root = document.querySelector('#root');
                            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
                            console.error(err);
                            }
                    }, false);
                </script>
            </body>
        </html>
        `;

    return (
        <div>
            <CodeEditor
                initialValue='const b=10;'
                onChange={(value) => setInput(value)}
            />
            <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{ height: '200px', width: '500px' }}>
            </textarea>
            <div style={{ paddingBottom: '5px' }}>
                <button onClick={onClick}>Submit</button>
            </div>
            {/* <pre>{code}</pre> */}
            <iframe
                title='Preview'
                ref={iframe}
                sandbox="allow-scripts"
                srcDoc={html}
                style={{ height: '200px', width: '500px' }}>
            </iframe>
        </div>
    );
};

root.render(<App />);