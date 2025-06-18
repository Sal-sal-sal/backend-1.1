export const UpdateTask = async (id: number, title: string, description: string) => {
    const response = await fetch(`http://localhost:8000/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
    });
    if (response.ok) {
        console.log("Task updated successfully");
    } else {
        console.error("Failed to update task");
        throw new Error("Failed to update task");
    }
};

export const UpdateTaskStatus = async (id: number, completed: boolean) => {
    const response = await fetch(`http://localhost:8000/tasks/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
    });
    if (response.ok) {
        console.log("Task status updated successfully");
    } else {
        console.error("Failed to update task status");
        throw new Error("Failed to update task status");
    }
}; 