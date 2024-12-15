import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { createRoot } from "react-dom/client";
// import CodeCell from './components/code-cell';
import TextEditor from './components/text-editor';

const container = document.getElementById('root');
const root = createRoot(container!);

const App = () => {
    return (
        <div>
            {/* <CodeCell /> */}
            <TextEditor />
        </div>
    );
};

root.render(<App />);