import React, { useState } from 'react';
import { FileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import InfiteList from './components/InfiniteList';
import NewTaskFrom from './components/NewTaskForm';
import { useTasksStore } from './tasksStore';

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}
const items: MenuItem[] = [
    getItem('Задачи', 'tasks', <FileOutlined />, [
        getItem('Все', 'all'),
        getItem('Выполненные', 'completed'),
        getItem('Не Выполненные', 'active'),
        getItem('Избранные', 'favorite'),
        getItem('Добавить', 'add')
    ]),
];

const App: React.FC = () => {
    const setAction = useTasksStore((state) => state.setAction)
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const currentAction = useTasksStore((state) => state.currentAction)
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" selectedKeys={[currentAction]} defaultOpenKeys={['tasks']} mode="inline" items={items} onClick={(selectedItem) => { setAction(selectedItem.key) }} />
            </Sider>
            <Layout>
                <Content style={{ margin: '0 16px' }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {(currentAction === "add") && <NewTaskFrom />}
                        {(currentAction === "completed") && <InfiteList typeParam={currentAction} />}
                        {(currentAction === "active") && <InfiteList typeParam={currentAction} />}
                        {(currentAction === "favorite") && <InfiteList typeParam={currentAction} />}
                        {(currentAction === "all") && <InfiteList typeParam={currentAction} />}
                    </div>
                </Content>

            </Layout>
        </Layout>
    );
};

export default App;