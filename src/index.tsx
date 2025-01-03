import 'bulmaswatch/superhero/bulmaswatch.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';
import { store } from './state';
// import CodeCell from './components/code-cell';
// import TextEditor from './components/text-editor';
import CellList from './components/cell-list';

const container = document.getElementById('root');
const root = createRoot(container!);

const App = () => {
    return (
        <Provider store={store}>
            <div>
                {/* <CodeCell /> */}
                {/* <TextEditor /> */}
                <CellList />
            </div>
        </Provider>
    );
};

root.render(<App />);