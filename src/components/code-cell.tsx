import './code-cell.css';
import { useEffect } from "react";
import CodeEditor from './code-editor';
import Preview from './preview';
//import bundle from '../bundler';
import Resizable from "./resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";
import { useTypedSelector } from "../hooks/use-typed-selector";

interface CodeCellProps {
    cell: Cell
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
    const { updateCell, createBundle } = useActions();
    const bundle = useTypedSelector((state) => state.bundles?.[cell.id]);
    const cumulativeCode = useTypedSelector((state) => {
        const { data, order } = state.cells;
        const cumulativeCells = order.map(id => data?.[id]);

        const cumulativeCode = [
            `
            import _React from 'react';
            import { createRoot as _createRoot } from "react-dom/client";

            const show = (value) => {
                const root = document.querySelector('#roote');
                if (root) {
                    if (typeof value === 'object') {
                        if(value.$$typeof && value.props) {
                            const navRoot = _createRoot(root);
                            navRoot.render(value);
                        } else {
                            root.innerHTML = JSON.stringify(value);
                        }
                    } else {
                        root.innerHTML = value;
                    }
                } else {
                        console.log(value);
                        console.log(root);
                    }
            };
            `
        ];
        for (let c of cumulativeCells) {
            if (c?.type === 'code') {
                cumulativeCode.push(c.content);
            }
            if (c?.id === cell.id) {
                break;
            }
        }
        return cumulativeCode;
    });

    useEffect(() => {
        if (!bundle) {
            createBundle(cell.id, cumulativeCode?.join('\n'));
        }

        const timer = setTimeout(async () => {
            createBundle(cell.id, cumulativeCode?.join('\n'));
        }, 100);

        return () => {
            clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cell.id, cumulativeCode?.join('\n'), createBundle]);

    return (
        <Resizable direction="vertical">
            <div style={{ height: 'calc(100% - 10px)', display: 'flex', flexDirection: 'row' }}>
                <Resizable direction='horizontal'>
                    <CodeEditor
                        initialValue={cell?.content}
                        onChange={(value) => updateCell(cell.id, value)}
                    />
                </Resizable>
                <div className='progress-wrapper'>
                    {!bundle || bundle?.loading
                        ? (
                            <div className="progress-cover">
                                <progress className="progress is-small is-primary" max="100">
                                    Loading
                                </progress>
                            </div>

                        )
                        : (<Preview code={bundle?.code} err={bundle?.err} />)
                    }
                </div>
            </div>
        </Resizable>
    );
};


export default CodeCell;