import { create } from "zustand";
import axios from "axios";

const token = 'a56017bfd8f1a9d1c8d012e881ef7df90ddc4e3d74e61a27b82fa975cfe37571fcb0e7617258e871291c4315b68c1c410274fb19269becf5dae7b5372d611d66c605c701817bd70f8fcd39aa44973e95fb1dff1b36e3271ba4bf890e074e52d9b9feddcee0947e588d7b5f6eef4bd4ead3993c6ee7b35ffddf22012c2b5589ed';

export enum TaskStatus {
    Active = "Не выполненные",
    Completed = "Выполненные",
}

export interface TaskModel {
    id?: number,
    attributes: {
        title: string;
        description: string;
        status: TaskStatus;
        createdAt?: Date;
        updatedAt?: Date;
        publishedAt?: Date;
    }
}

interface TaskState {
    currentAction: string,
    currentPage: number;
    tasks: TaskModel[];
    favorites: number[];
    total: number;
    fetchTasks: (type?: string) => Promise<void>;
    addTask: (newTask: TaskModel, favorite: boolean) => Promise<void>;
    removeTask: (id: number) => Promise<void>;
    selectTask: (id: number) => void;
    updateStatus: (id: number, status: TaskStatus) => Promise<void>;
    setAction: (action?: string) => void
}

export const useTasksStore = create<TaskState>((set) => ({
    currentAction: "all",
    currentPage: 0,
    total: 0,
    tasks: [] as TaskModel[],
    favorites: [] as number[],

    fetchTasks: async (type?) => {
        const size = 4;
        let page = useTasksStore.getState().currentPage + 1
        axios
            .get(`https://cms.dev-land.host/api/tasks?pagination%5BwithCount%5D=true&pagination%5Bpage%5D=${page}&pagination%5BpageSize%5D=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                set((state) => ({
                    total: response.data.meta.pagination.total,
                    tasks: type === "favorite" ? (state.tasks.concat(response.data.data)).filter(el => localStorage.favorites.includes(el.id))
                        : type === "active" ? (state.tasks.concat(response.data.data)).filter(el => el.attributes.status === TaskStatus.Active)
                            : type === "completed" ? (state.tasks.concat(response.data.data)).filter(el => el.attributes.status === TaskStatus.Completed)
                                : (state.tasks.concat(response.data.data))
                })
                )
            })

            .catch(error => console.log(error))
        const storedFavoriteTasks = localStorage.getItem("favorites")
        set(() => ({
            currentPage: page,
            favorites: storedFavoriteTasks ? JSON.parse(storedFavoriteTasks) : [],
        }))
    },

    addTask: async (newTask: TaskModel, favorite: boolean) => {
        if (newTask.attributes.title !== '')
            axios
                .post('https://cms.dev-land.host/api/tasks', { data: newTask.attributes }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    //set((state) => ({ tasks: [...state.tasks, response.data.data] }))
                    set(() => ({ currentAction: "all" }))
                    if (favorite) {
                        let temp = localStorage.favorites;
                        let favTasks = temp ? JSON.parse(temp) : []
                        localStorage.favorites = JSON.stringify([...favTasks, response.data.data.id])
                    }
                })
                .catch(error => console.log(error))
    },

    removeTask: async (id: number) => {
        axios
            .delete(`https://cms.dev-land.host/api/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(() => {
                set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }))
            })
            .catch(error => console.log(error))
    },

    selectTask: (id: number) => {

        const check = (id: number, arr: number[]) => {
            if (arr.includes(id))
                return arr.filter(element => element !== id)
            else return [...arr, id]
        }

        const temp = localStorage.getItem("favorites")
        const favorites = temp ? JSON.parse(temp) : []
        const updatedFavorites = check(id, favorites)
        localStorage.favorites = JSON.stringify(updatedFavorites)
        set(() => (
            {
                favorites: updatedFavorites
            }))
    },

    updateStatus: async (id: number, newStatus: TaskStatus) => {
        const data = {
            status: newStatus
        }
        axios
            .put(`https://cms.dev-land.host/api/tasks/${id}`, { data: data }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                set((state) => ({
                    tasks: state.tasks.map((task) => {
                        if (task.id !== id) return task
                        //else {Object.assign(task.attributes,{status:newStatus})}
                        else return response.data.data
                    })
                }
                ))
            })
            .catch(error => console.log(error))
    },

    setAction(action) {
        set(() => ({ currentAction: action, currentPage: 0, tasks: [] as TaskModel[] }))
    },
}))