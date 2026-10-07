import { renderToString } from 'react-dom/server';
import App from './App';
import { TodoProvider } from './components/TodoProvider';
export function render() { return renderToString(<TodoProvider><App /></TodoProvider>); }
