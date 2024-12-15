import './resizable.css';
import { useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from "react-resizable";

interface ResizableProps {
    direction: "horizontal" | "vertical";
    children?: React.ReactNode;
};

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
    let resizableProps: ResizableBoxProps;

    const [innerHeight, setInnerHeight] = useState(Math.floor(window.innerHeight));
    const [innerWidth, setInnerWidth] = useState(Math.floor(window.innerWidth));
    const [width, setWidth] = useState(Math.floor(window.innerWidth * 0.75));

    useEffect(() => {
        let timer: any;
        const listener = () => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                setInnerWidth(Math.floor(window.innerWidth));
                setInnerHeight(Math.floor(window.innerHeight));
                if (Math.floor(window.innerWidth * 0.75) < width) {
                    setWidth(Math.floor(window.innerWidth * 0.75));
                }
            }, 100);
        };
        window.addEventListener('resize', listener);

        return () => {
            window.removeEventListener('resize', listener);
        };
    });

    if (direction === 'horizontal') {
        resizableProps = {
            className: 'resize-horizontal',
            minConstraints: [Math.floor(innerWidth * 0.2), Infinity],
            maxConstraints: [Math.floor(innerWidth * 0.75), Infinity],
            height: Infinity,
            width,
            resizeHandles: ['e'],
            onResizeStop: (e, data) => {
                setWidth(Math.floor(data.size.width));
            },
        };
    } else {
        resizableProps = {
            minConstraints: [Infinity, Math.floor(innerHeight * 0.1)],
            maxConstraints: [Infinity, Math.floor(innerHeight * 0.9)],
            height: 300,
            width: Infinity,
            resizeHandles: ['s'],
        };
    }

    return <ResizableBox {...resizableProps}>
        {children}
    </ResizableBox>;
};

export default Resizable;