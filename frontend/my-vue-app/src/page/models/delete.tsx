

export const DeleteTasks = async (id: number) => {
    const response = await fetch(`http://localhost:8000/tasks/${id}`, {
        method: "DELETE",
    });
    if (response.ok) {
        console.log("Task deleted successfully");
    } else {
        console.error("Failed to delete task");
    }
};