import { useState, useEffect } from 'react'
import axios from 'axios';
import './App.css'

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

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const response = await axios.get('/api/groups.json');
                /*const data: GetGroupsResponse = response.data; данный вариант подходит для настоящего запроса с бэкенда
                для проверки значения result, также в if мы бы добавили проверку data.result === 1*/
                const data: Group[]= response.data;
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
        <div>
            {groups !== undefined ? (
                groups.length > 0 ? (
                    groups.map((group) => (
                        <div className="group" key={group.id}>
                            {group.name}
                        </div>
                    ))
                ) : (
                    <div>Загрузка...</div>
                )
            ) : null}
        </div>
    );
};

export default App;
