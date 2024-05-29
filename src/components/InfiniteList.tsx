import InfiniteScroll from "react-infinite-scroll-component"
import { useTasksStore, TaskStatus } from "../tasksStore"
import React, { useEffect, useState } from "react"
import { Button, Divider, List, Typography } from 'antd';

const buttonStyle = {
    margin: "10px 20px 10px 15px",
    width: "200px"
}

interface InfiniteListProps {
    typeParam?: string;
}
const InfiniteList: React.FC<InfiniteListProps> = ({ typeParam }) => {
    const tasks = useTasksStore((state) => state.tasks)
    const action = useTasksStore((state) => state.currentAction)
    const [type, setType] = useState('')
    const fetchTask = useTasksStore((state) => state.fetchTasks)
    const removeTask = useTasksStore((state) => state.removeTask)
    const updateStatus = useTasksStore((state) => state.updateStatus)
    const selectTask = useTasksStore((state) => state.selectTask)
    const favoritesTasks = useTasksStore((state => state.favorites))
    const hasMore = tasks.length < useTasksStore((state) => state.total)

    useEffect(() => {
        switch (typeParam) {
            case "completed": setType("Выполненные"); break
            case "active": setType("Не выполненные"); break
            case "favorite": setType("Избранные"); break
            case "all": setType("Все"); break
        }
        fetchTask(typeParam)
    }, [action])
    return (
        <div id="scrollableDiv">
            <h2 >Список задач ({tasks.length})</h2>
            <InfiniteScroll
                dataLength={tasks.length}
                next={() => fetchTask(typeParam)}
                hasMore={hasMore}
                loader={<p>Загрузится...</p>}
                endMessage={<p>Больше не данных.</p>}
                scrollableTarget="scrollableDiv"
            >
                <Divider orientation="left">{type} Задачи</Divider>
                <List
                    bordered
                    dataSource={tasks}
                    renderItem={(item) => (
                        <div>
                            <List.Item style={{ display: "block", justifyContent: "center", alignItems: "center" }}>
                                <Typography.Text style={{ fontWeight: "700" }}> Задача:{item.attributes.title}</Typography.Text>
                                <div><Typography.Text style={{ fontWeight: "400" }} >{item.attributes.description}</Typography.Text></div>
                                <div style={{ width: "100%", justifyContent: "space-between" }}>
                                    {item.attributes.status === TaskStatus.Active &&
                                        <Button type="primary" style={buttonStyle} onClick={() => updateStatus(Number(item.id), TaskStatus.Completed)}> Выполнить
                                        </Button>}
                                    {item.attributes.status === TaskStatus.Completed &&
                                        <Button style={buttonStyle} onClick={() => updateStatus(Number(item.id), TaskStatus.Active)}> Продолжать
                                        </Button>}
                                    {favoritesTasks.includes(Number(item.id)) &&
                                        <Button type="dashed" style={buttonStyle} onClick={() => selectTask(Number(item.id))}> Убраить отметку
                                        </Button>}
                                    {!favoritesTasks.includes(Number(item.id)) &&
                                        <Button type="primary" style={buttonStyle} onClick={() => selectTask(Number(item.id))}> Отметить
                                        </Button>}
                                    <Button style={buttonStyle} danger onClick={() => removeTask(Number(item.id))}> Удалить </Button>

                                </div>
                            </List.Item>
                        </div>
                    )
                    }
                />
            </InfiniteScroll >
        </div >)
}

export default InfiniteList