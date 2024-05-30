import { describe, expect, test } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import InfiniteList from "../components/InfiniteList";
import NewTaskForm from "../components/NewTaskForm";

window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};
describe("NewTaskForm", () => {
    test("renders", () => {
        render(<NewTaskForm />);
        expect(screen.getByText(/Зачача/i)).toBeDefined();
    });
});
describe("ListInfinite", () => {
    test("renders", () => {
        render(<InfiniteList typeParam={"all"} />);
        expect(screen.getByText(/Больше нет данных./i)).toBeDefined();
    });
});

describe("ListInfiniteFetch(List and List Item)", () => {
    const renderList = () => (render(<InfiniteList typeParam="all" />));

    test("renders", async () => {
        const { getAllByRole } = renderList();

        await waitFor(() => {
            const taskList = getAllByRole('list')
            const task = getAllByRole('listitem');
            expect(taskList).toBeDefined();
            expect(task).toBeDefined();
        })
        // render(<InfiniteList typeParam={"all"} />);
        // expect(screen.getByText('Список задач')).toBeDefined();
    });
});
describe("ListInfiniteFetch(Delete List Item)", () => {
    const renderList = () => (render(<InfiniteList typeParam="all" />));

    test("renders", async () => {
        const { getAllByText, getAllByRole } = renderList();


        await waitFor(() => {
            const task = getAllByRole('listitem').length;
            const deleteButon = getAllByText(/удалить/i)
            fireEvent.click(deleteButon[0])

            waitFor(() => expect(getAllByRole('listitem').length).toBe(task - 1));
        })
        // render(<InfiniteList typeParam={"all"} />);
        // expect(screen.getByText('Список задач')).toBeDefined();
    });
});


