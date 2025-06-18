from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Depends, HTTPException

from ..database import get_session
from .models import Task, TaskCreate


class TaskCRUD:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.session = session

    async def create_task(self, task_data: TaskCreate) -> Task:
        task = Task(**task_data.model_dump())
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def update_task(self, task_id: int, task_data: TaskCreate) -> Task:
        task = await self.get_task(task_id)
        for key, value in task_data.model_dump().items():
            setattr(task, key, value)
        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def get_task(self, task_id: int) -> Task:
        result = await self.session.execute(select(Task).where(Task.id == task_id))
        task = result.scalar_one_or_none()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task

    async def get_all_tasks(self) -> List[Task]:
        result = await self.session.execute(select(Task))
        return result.scalars().all()
    
    async def delete_task(self, task_id: int) -> Task:
        task = await self.get_task(task_id)
        await self.session.delete(task)
        await self.session.commit()
        return task
    
    # @staticmethod
    # def update_task(id:int, task_data: TaskCreate)-> Task:
    #     return update_task(id, task_data)