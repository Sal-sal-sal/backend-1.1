from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from pydantic import BaseModel

from .models import TaskCreate, TaskResponse
from .crud import TaskCRUD
from ..database import get_session

router = APIRouter(prefix="/tasks")

class TaskStatusUpdate(BaseModel):
    completed: bool

@router.post("/", response_model=TaskResponse)
async def create_new_task(
    task_data: TaskCreate,
    session: AsyncSession = Depends(get_session)
):
    return await TaskCRUD(session).create_task(task_data)

@router.get("/{task_id}", response_model=TaskResponse)
async def read_task(
    task_id: int,
    session: AsyncSession = Depends(get_session)
):
    return await TaskCRUD(session).get_task(task_id)

@router.get("/", response_model=List[TaskResponse])
async def read_tasks(
    session: AsyncSession = Depends(get_session)
):
    return await TaskCRUD(session).get_all_tasks()

@router.delete("/{task_id}", response_model=TaskResponse)
async def remove_task( 
    task_id: int,
    session: AsyncSession = Depends(get_session)
):
    return await TaskCRUD(session).delete_task(task_id)

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int, 
    task_data: TaskCreate, 
    session: AsyncSession = Depends(get_session)
):
    return await TaskCRUD(session).update_task(task_id, task_data)

@router.patch("/{task_id}/status", response_model=TaskResponse)
async def update_task_status(
    task_id: int,
    status_update: TaskStatusUpdate,
    session: AsyncSession = Depends(get_session)
):
    task = await TaskCRUD(session).get_task(task_id)
    task.completed = status_update.completed
    await session.commit()
    await session.refresh(task)
    return task