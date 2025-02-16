import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
    return useTypedSelector((state) => {
        const { data, order } = state.cells;
        const cumulativeCells = order.map(id => data?.[id]);

        const showFunc = `
            import _React from 'react';
            import { createRoot as _createRoot } from "react-dom/client";

            var show = (value) => {
                const root = document.querySelector('#root');
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
            `;

        const showFuncNoop = 'var show = () => { };';
        const cumulativeCode = [];

        for (let c of cumulativeCells) {
            if (c?.type === 'code') {
                if (c.id === cellId) {
                    cumulativeCode.push(showFunc);
                } else {
                    cumulativeCode.push(showFuncNoop);
                }
                cumulativeCode.push(c.content);
            }
            if (c?.id === cellId) {
                break;
            }
        }
        return cumulativeCode;
    }).join('\n');

};