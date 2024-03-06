import { createRoot } from 'react-dom/client';
import {
    AdaptivityProvider,
    ConfigProvider,
    AppRoot,
    SplitLayout,
    SplitCol,
    View,
    Panel,
    PanelHeader,
    Header,
    Group,
    SimpleCell,
    usePlatform,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

// eslint-disable-next-line react-refresh/only-export-components
const AppShell = () => {
    const platform = usePlatform();

    return (
        <AppRoot>
            <SplitLayout header={platform !== 'vkcom' && <PanelHeader delimiter="none" />}>
                <SplitCol autoSpaced>
                    <View activePanel="main">
                        <Panel id="main">
                            <PanelHeader>VKUI</PanelHeader>
                            <Group header={<Header mode="secondary">Items</Header>}>
                                <SimpleCell>Hello</SimpleCell>
                                <SimpleCell>World</SimpleCell>
                            </Group>
                        </Panel>
                    </View>
                </SplitCol>
            </SplitLayout>
        </AppRoot>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <ConfigProvider>
        <AdaptivityProvider>
            <AppShell />
        </AdaptivityProvider>
    </ConfigProvider>,
);