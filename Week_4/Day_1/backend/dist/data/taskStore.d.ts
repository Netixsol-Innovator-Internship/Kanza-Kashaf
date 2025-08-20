import type { Task } from "../types/task";
declare class TaskStore {
    private tasks;
    private nextId;
    getAllTasks(): Task[];
    getTaskById(id: string): Task | undefined;
    createTask(title: string): Task;
    updateTask(id: string, updates: Partial<Pick<Task, "title" | "completed">>): Task | null;
    deleteTask(id: string): boolean;
    getStats(): {
        total: number;
        completed: number;
        pending: number;
    };
}
export declare const taskStore: TaskStore;
export {};
//# sourceMappingURL=taskStore.d.ts.map