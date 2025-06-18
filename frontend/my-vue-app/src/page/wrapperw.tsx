import { useEffect, useState } from "react";
import { DeleteTasks } from "./models/delete";
import { PostTasks } from "./models/posts";
import { UpdateTask, UpdateTaskStatus } from "./models/update";

interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

export default function Read() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [errors, setErrors] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [editingFields, setEditingFields] = useState<{ [key: number]: { title: string; description: string } }>({});

    const getTasks = async () => {
        const response = await fetch("http://localhost:8000/tasks");
        const data = await response.json();
        setTasks(data);
    }

    useEffect(() => {
        getTasks();
    }, []);

    const handleDelete = async (id: number) => {
        await DeleteTasks(id);
        getTasks();
    }

    const handleToggleStatus = async (task: Task) => {
        try {
            await UpdateTaskStatus(task.id, !task.completed);
            getTasks();
        } catch (err) {
            setErrors('Failed to update task status');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors('');
    };

    const handleInlineEdit = (taskId: number, field: 'title' | 'description', value: string) => {
        setEditingFields(prev => ({
            ...prev,
            [taskId]: {
                ...prev[taskId],
                [field]: value
            }
        }));
    };

    const handleInlineSave = async (taskId: number) => {
        const editedFields = editingFields[taskId];
        if (!editedFields) return;

        try {
            await UpdateTask(taskId, editedFields.title, editedFields.description);
            setEditingFields(prev => {
                const newFields = { ...prev };
                delete newFields[taskId];
                return newFields;
            });
            getTasks();
        } catch (err) {
            setErrors('Failed to update task');
        }
    };

    const handleInlineCancel = (taskId: number) => {
        setEditingFields(prev => {
            const newFields = { ...prev };
            delete newFields[taskId];
            return newFields;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors('');

        if (!formData.title.trim()) {
            setErrors('Title is required');
            return;
        }

        if (!formData.description.trim()) {
            setErrors('Description is required');
            return;
        }

        try {
            await PostTasks(formData.title, formData.description);
            setFormData({ title: '', description: '' });
            getTasks();
        } catch (err) {
            setErrors('Failed to save task. Please try again.');
        }
    };

    return (
        <div>
            <h1>Read</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
                <div className="flex flex-row gap-2">
                    <input 
                        type="text" 
                        name="title"
                        value={formData.title}
                        placeholder="Title" 
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                    />
                    <input 
                        type="text" 
                        name="description"
                        value={formData.description}
                        placeholder="Description" 
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                    />
                    <button 
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add Task
                    </button>
                </div>
                {errors && (
                    <p className="text-red-500 text-sm mt-2">{errors}</p>
                )}
            </form>
            
            <ul className="flex flex-col gap-2">
                {tasks.map((task) => (
                    <li key={task.id} className={`border p-2 rounded ${task.completed ? 'bg-green-50' : ''}`}>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleStatus(task)}
                                className="w-4 h-4"
                            />
                            {editingFields[task.id] ? (
                                <div className="flex flex-col gap-2 w-full">
                                    <input
                                        type="text"
                                        value={editingFields[task.id].title}
                                        onChange={(e) => handleInlineEdit(task.id, 'title', e.target.value)}
                                        className="border p-1 rounded"
                                    />
                                    <input
                                        type="text"
                                        value={editingFields[task.id].description}
                                        onChange={(e) => handleInlineEdit(task.id, 'description', e.target.value)}
                                        className="border p-1 rounded"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleInlineSave(task.id)}
                                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => handleInlineCancel(task.id)}
                                            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col w-full">
                                    <div className="flex items-center justify-between">
                                        <div className={`font-bold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                            {task.title}
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setEditingFields(prev => ({
                                                    ...prev,
                                                    [task.id]: { title: task.title, description: task.description }
                                                }))}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(task.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className={`text-gray-600 ${task.completed ? 'line-through' : ''}`}>
                                        {task.description}
                                    </div>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}