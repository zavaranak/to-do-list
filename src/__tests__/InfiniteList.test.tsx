import { describe, expect, test } from "vitest";
import { render, screen, } from "@testing-library/react";
import InfiniteList from "../components/InfiniteList";
import NewTaskForm from "../components/NewTaskForm";

describe("NewTaskForm", () => {
    test("renders", () => {
        render(<NewTaskForm />);
        expect(screen.getByText(" ")).toBeDefined();
    });
});