import { describe, expect, test } from "vitest";
import { render, screen, } from "@testing-library/react";
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
describe("ListInfiniteFetch", () => {
    test("renders", () => {
        render(<InfiniteList typeParam={"all"} />);
        expect(screen.getByText('Список задач')).toBeDefined();
    });
});



