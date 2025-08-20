declare const router: import("express-serve-static-core").Router;
export interface CreateTaskRequest {
    title: string;
}
export interface UpdateTaskRequest {
    title?: string;
}
export interface Task {
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export default router;
//# sourceMappingURL=task.d.ts.map