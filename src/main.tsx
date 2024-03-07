import { createRoot } from 'react-dom/client';
import {
    AdaptivityProvider,
    ConfigProvider
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import App from './App';


const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <ConfigProvider>
        <AdaptivityProvider>
            <App />
        </AdaptivityProvider>
    </ConfigProvider>,
);