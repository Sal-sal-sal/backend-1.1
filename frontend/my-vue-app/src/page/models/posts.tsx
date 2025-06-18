export const PostTasks = async (title: string, description: string) => {
    const response = await fetch('http://127.0.0.1:8000/tasks/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
    });
    if (response.ok) {
        console.log("Task created successfully");
    } else {
        console.error("Failed to create task");
    }
}