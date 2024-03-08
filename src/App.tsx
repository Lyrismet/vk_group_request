import {useState, useEffect, useCallback} from 'react';
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
    Avatar,
    Paragraph,
    Subhead,
    Title,
    Div,
    Card,
    PopoverOnShownChange,
    Popover,
    IconButton,
    Button
} from '@vkontakte/vkui';
import {IoCloseCircle} from "react-icons/io5";
import './App.css'
import '@vkontakte/vkui/dist/vkui.css';
import {InitialsAvatarTextGradients} from "@vkontakte/vkui/dist/components/Avatar/Avatar";

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
    const platform = usePlatform();
    const [groups, setGroups] = useState<Group[]>([]);
    const [privacyFilter, setPrivacyFilter] = useState('all')
    const [friendFilter, setFriendFilter] = useState(false)
    const [avatarColorFilter, setAvatarColorFilter] = useState('any')
    const [shownId, setShownId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    const filteredGroups = groups.filter(group => {
        if (privacyFilter === 'closed' && !group.closed) return false;
        if (privacyFilter === 'open' && group.closed) return false;
        if (avatarColorFilter !== 'any') {
            if (avatarColorFilter === 'none') return !group.avatar_color;
            else {
                if (!group.avatar_color || group.avatar_color !== avatarColorFilter) return false;
            }
        }
        return !(friendFilter && (!group.friends || group.friends.length === 0));
    });
    const getColor = (color: string | undefined): string => {
        if (!color) return 'custom';
        if (color === 'purple') return 'violet';
        if (color === 'white') return 'custom';
        return color;
    };
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setIsLoading(true);
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchGroups().then(() => {
        });
    }, []);



    const handleShownChange: PopoverOnShownChange = useCallback((value, reason) => {
        if (!value) {
            switch (reason) {
                case 'callback':
                case 'escape-key':
                case 'click-outside':
                    setShownId(null);
                    break;
                default:
                    break;
            }
        }
    }, []);

    const handleFriendButtonClick = (groupId: number) => {
        setShownId(groupId !== shownId ? groupId : null);
    };
    return (
        <AppRoot>
            <SplitLayout header={platform !== 'vkcom' && <PanelHeader delimiter="none"/>}>
                <SplitCol autoSpaced>
                    <View activePanel="main">
                        <Panel id="main">
                            <PanelHeader>VKUI. Исходный код: <a target="_blank" href="https://github.com/Lyrismet/vk_group_request">https://github.com/Lyrismet/vk_group_request</a> </PanelHeader>
                            <Group header={<Header mode="secondary">Groups</Header>}>
                                <Card mode="outline">
                                    <Header>Сортировка</Header>
                                    <Div>
                                        <label>Приватность:
                                            <select value={privacyFilter}
                                                    onChange={(e) => setPrivacyFilter(e.target.value)}>
                                                <option value="all">Все</option>
                                                <option value="closed">Закрытые</option>
                                                <option value="open">Открытые</option>
                                            </select>
                                        </label>
                                        <label>Цвет:
                                            <select value={avatarColorFilter}
                                                    onChange={(e) => setAvatarColorFilter(e.target.value)}>
                                                <option value="any">Любой</option>
                                                <option value="red">Красный</option>
                                                <option value="green">Зеленый</option>
                                                <option value="yellow">Желтый</option>
                                                <option value="blue">Синий</option>
                                                <option value="white">Белый</option>
                                                <option value="purple">Фиолетовый</option>
                                                <option value="orange">Оранжевый</option>
                                                <option value="none">Без цвета</option>
                                            </select>
                                        </label>
                                        <label>
                                            <input type="checkbox" checked={friendFilter}
                                                   onChange={(e) => setFriendFilter(e.target.checked)}/>
                                            Только группы с друзьями
                                        </label>
                                    </Div>
                                </Card>
                                {isLoading ? (
                                    <Title style={{padding: "10px"}}>Загрузка...</Title>
                                ) : (
                                    filteredGroups !== undefined ? (
                                        filteredGroups.length > 0 ? (
                                            filteredGroups.map((group) => (
                                            <SimpleCell
                                                key={group.id}
                                                before={<Avatar
                                                    size={100}
                                                    src="#"
                                                    initials={group.name[0] + group.name[1]}
                                                    gradientColor={getColor(group.avatar_color) as InitialsAvatarTextGradients}
                                                    style={group.avatar_color === 'white' ? {
                                                        backgroundImage: 'linear-gradient(135deg, #ffffff, #dddddd)',
                                                        color: 'black'
                                                    } : undefined}/>}
                                            >
                                                <Header
                                                    mode="primary"
                                                    size="large"
                                                    aside={<Subhead
                                                        style={group.closed ? {color: '#e97171'} : {color: '#71c971'}}
                                                        weight="3">{group.closed ? 'Закрытая' : 'Открытая'}</Subhead>}
                                                    subtitle={<Subhead>{`Участники: ${group.members_count}`}
                                                        <Subhead style={{marginTop: 10}}>
                                                            <Paragraph className="paragraph"
                                                                       style={{color: "white", position: "relative"}}
                                                                       weight="1">
                                                                {group.friends && group.friends.length > 0 ? (<Popover
                                                                        trigger="manual"
                                                                        shown={shownId === group.id}
                                                                        role="dialog"
                                                                        aria-describedby={`friends-${group.id}`}
                                                                        placement="right"
                                                                        content={({onClose}) => (
                                                                            <div style={{
                                                                                display: 'flex',
                                                                                position: 'relative',
                                                                                width: 180,
                                                                                height: 100
                                                                            }}>
                                                                                <div style={{
                                                                                    position: 'absolute',
                                                                                    top: 0,
                                                                                    right: 0
                                                                                }}>
                                                                                    <IconButton onClick={onClose}>
                                                                                        <IoCloseCircle style={{top:"-6px", right:"3px"}} size={24}/>
                                                                                    </IconButton>
                                                                                </div>
                                                                                <div style={{
                                                                                    margin: 'auto',
                                                                                    textAlign: 'center'
                                                                                }}>
                                                                                    {group.friends?.map((friend, id) => (
                                                                                        <div
                                                                                            key={id}>{friend.last_name + ' ' + friend.first_name}</div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        onShownChange={handleShownChange}>

                                                                    <Button id={`friends-${group.id}`} mode="secondary"
                                                                            onClick={() => handleFriendButtonClick(group.id)}>
                                                                        {`Друзья: ${group.friends.length}`}
                                                                    </Button>
                                                                </Popover>
                                                                ) : ''}
                                                            </Paragraph>
                                                        </Subhead>
                                                    </Subhead>}
                                                    subtitleComponent="div"
                                                >
                                                    {group.name}
                                                </Header>
                                            </SimpleCell>
                                        ))
                                        ) : (
                                            <Title style={{padding: "10px"}}>Нет доступных групп</Title>
                                        )
                                    ) : null
                                )}
                            </Group>
                        </Panel>
                    </View>
                </SplitCol>
            </SplitLayout>
        </AppRoot>
    );
};

export default App;
