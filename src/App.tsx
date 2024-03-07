import {useState, useEffect} from 'react';
import axios from 'axios';
import {
    usePlatform,
    AppRoot,
    SplitLayout,
    SplitCol,
    View,
    Panel,
    PanelHeader,
    Group,
    Header,
    SimpleCell,
    Avatar, Paragraph, Subhead,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

/* данный интерфейс требуется для запроса с реального бекенда для проверки значения result
interface GetGroupsResponse {
    result: 1 | 0,
    data?: Group[]
}*/

interface Group {
    "id": number,
    "name": string,
    "closed": boolean,
    "avatar_color"?: string,
    "members_count": number,
    "friends"?: User[]
}

interface User {
    "first_name": string,
    "last_name": string
}

const App = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const platform = usePlatform();
    const getColor = (color: string | undefined): string => {
        if (!color) return 'custom';
        if (color === 'purple') return 'violet';
        if (color === 'white') return 'custom';
        return color;
    };
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const response = await axios.get('/api/groups.json');
                /*const data: GetGroupsResponse = response.data; данный вариант подходит для настоящего запроса с бэкенда
                для проверки значения result, также в if мы бы добавили проверку data.result === 1*/
                const data: Group[] = response.data;
                if (data) {
                    setGroups(data);
                } else {
                    console.error('Ошибка получения данных о группах');
                }

            } catch (error) {
                console.error('Ошибка при запросе данных о группах:', error);
            }
        };

        fetchGroups();
    }, []);

    return (
        <AppRoot>
            <SplitLayout header={platform !== 'vkcom' && <PanelHeader delimiter="none"/>}>
                <SplitCol autoSpaced>
                    <View activePanel="main">
                        <Panel id="main">
                            <PanelHeader>VKUI</PanelHeader>
                            <Group header={<Header mode="secondary">Groups</Header>}>
                                <Panel>
                                    <SimpleCell>Сортировка</SimpleCell>
                                </Panel>
                                {groups !== undefined ? (
                                    groups.length > 0 ? (
                                        groups.map((group) => (
                                            <SimpleCell
                                                key={group.id}
                                                before={<Avatar
                                                    size={100}
                                                    src="#"
                                                    initials={group.name[0] + group.name[1]}
                                                    gradientColor={getColor(group.avatar_color)}
                                                    style={group.avatar_color === 'white' ? {
                                                        backgroundImage: 'linear-gradient(135deg, #ffffff, #dddddd)',
                                                        color: 'black'
                                                    } : undefined}/>}>
                                                <Header
                                                    mode="primary"
                                                    size="large"
                                                    aside={<Subhead style={group.closed ? {color: '#e97171'} : {color: '#71c971'}} weight="3">{group.closed ? 'Закрытая' : 'Открытая'}</Subhead>}
                                                    subtitle={<Subhead>{`Кол-во участников: ${group.members_count}`}
                                                        <Subhead style={{marginTop:10}}>
                                                            <Paragraph style={{color: "white"}} weight="1">{group.friends && group.friends.length > 0 ? 'Друзья: ' + group.friends.length : ''}</Paragraph>
                                                        </Subhead>
                                                </Subhead>}
                                                    subtitleComponent="div"
                                                >
                                                    {group.name}
                                                </Header>
                                            </SimpleCell>
                                        ))
                                    ) : (
                                        <div>Загрузка...</div>
                                    )
                                ) : null}
                            </Group>
                        </Panel>
                    </View>
                </SplitCol>
            </SplitLayout>
        </AppRoot>
    );
};

export default App;
