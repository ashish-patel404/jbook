import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';
import { store } from './state';
// import CodeCell from './components/code-cell';
import TextEditor from './components/text-editor';

const container = document.getElementById('root');
const root = createRoot(container!);

const App = () => {
    return (
        <Provider store={store}>
            <div>
                {/* <CodeCell /> */}
                <TextEditor />
            </div>
        </Provider>
    );
};

root.render(<App />);