import './text-editor.css';
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useRef, useState } from "react";
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

interface TextEditorProps {
    cell: Cell
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [editing, setEditing] = useState(false);
    const { updateCell } = useActions();

    useEffect(() => {
        const listner = (event: MouseEvent) => {
            if (ref.current && event.target && ref.current.contains(event.target as Node)) {
                return;
            }

            setEditing(false);
        };

        document.addEventListener('click', listner, { capture: true });

        return () => {
            document.removeEventListener('click', listner, { capture: true });
        };

    }, []);

    if (editing) {
        return (
            <div className='text-editor' ref={ref}>
                <MDEditor
                    value={cell.content}
                    onChange={(v) => { updateCell(cell.id, v || ''); }}
                />
            </div>
        );
    }
    return (
        <div className='text-editor card' onClick={() => { setEditing(true); }}>
            <div className='card-content'>
                <MDEditor.Markdown source={cell.content || 'Click here to edit'} />
            </div>
        </div>
    );
};

export default TextEditor;