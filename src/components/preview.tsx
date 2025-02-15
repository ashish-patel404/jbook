import './preview.css';
import { useEffect, useRef, useState } from "react";

interface PreviewProps {
    code: string;
    err: string;
};


const html = `
<html>
    <head>
        <style>html { background-color: white; }</style>
    </head>
    <body>
        <div id="root"></div>
        <script>
            const handleError = (err)=>{
                const root = document.querySelector('#root');
                root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
                console.error(err);
            };

            window.addEventListener('error', (event)=>{
                event.preventDefault();
                handleError(event.error);
            });

            window.addEventListener('message', (event) => {
                try {
                    eval(event.data);
                    }
                catch (err) {
                    handleError(err);
                    }
            }, false);
        </script>
    </body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
    const iframe = useRef<any>();
    const [previewClassName, serPreviewClassName] = useState('preview-wrapper');
    useEffect(() => {
        serPreviewClassName('');
        iframe.current.srcdoc = html;
        // iframe.current.contentWindow.postMessage(code, '*');
        const timer = setTimeout(() => {
            iframe.current?.contentWindow?.postMessage(code, '*');
            serPreviewClassName('preview-wrapper');
        }, 1000);

        return () => {
            clearTimeout(timer);
        }
    }, [code]);

    return (
        <div className={previewClassName}>
            <iframe
                style={{ backgroundColor: 'white' }}
                title='Preview'
                ref={iframe}
                sandbox="allow-scripts"
                srcDoc={html}
            />
            {err && <div className='preview-error'>{err}</div>}
        </div>
    );
};

export default Preview;