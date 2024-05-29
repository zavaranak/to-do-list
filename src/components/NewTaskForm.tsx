import React, { useState } from 'react';
import { Button, Form, Input, Checkbox } from 'antd';
import { TaskStatus, useTasksStore, TaskModel } from "../tasksStore"


const NewTaskForm: React.FC = () => {
    const [form] = Form.useForm();
    const [task, setTask] = useState({ attributes: { title: "", description: "", status: TaskStatus.Active } } as TaskModel)
    const [favortie, setFavorite] = useState(false)
    const addTask = useTasksStore((state) => state.addTask)
    return (
        <Form
            form={form}
            layout="vertical"
        >
            <h1>Добавить новую задачу</h1>
            <Form.Item label="Зачача" required>
                <Input value={task.attributes.title} onChange={(event) => setTask({
                    ...task,
                    attributes: {
                        ...task.attributes,
                        title: event.target.value,
                    },
                })} />
            </Form.Item>
            <Form.Item label="Описание">
                <Input value={task.attributes.description} onChange={(event) => setTask({
                    ...task,
                    attributes: {
                        ...task.attributes,
                        description: event.target.value,
                    },
                })} />
            </Form.Item>
            <Checkbox onChange={() => setFavorite(prev => !prev)}>Отметить задачу избранной</Checkbox>
            <Form.Item>
                <Button type="primary"
                    onClick={() => {
                        if (task.attributes.title !== '') addTask(task, favortie)
                        else {
                            alert("Надо ввести назавание задачи")
                        }
                    }}>
                    Submit</Button>
            </Form.Item>
        </Form>
    );
};

export default NewTaskForm;