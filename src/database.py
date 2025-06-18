from typing import List
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from typing import AsyncGenerator
from sqlalchemy.orm import sessionmaker
from .tasks.models import Task, TaskCreate, Base
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import select
from fastapi import HTTPException

# Создаем движок базы данных
engine = create_async_engine(
    "sqlite+aiosqlite:///tasks.db",
    echo=True
)

# Создаем фабрику сессий
async_session = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    completed = Column(Boolean, default=False)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_task(task_id: int, session: AsyncSession) -> Task | None:
    result = await session.execute(select(Task).where(Task.id == task_id))
    return result.scalar_one_or_none()

async def save_task(task_data: TaskCreate, session: AsyncSession) -> Task:
    task = Task(**task_data.model_dump())
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task

async def delete_task(task_id: int, session: AsyncSession) -> Task:
    task = await get_task(task_id, session)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    await session.delete(task)
    await session.commit()
    return task

async def get_all_tasks(session: AsyncSession) -> List[Task]:
    result = await session.execute(select(Task))
    return result.scalars().all()


# _fake_db: List[Task] = []
# _id_counter = 1


# def save_task(task_data) -> Task:
#     global _id_counter
#     task = Task(id=_id_counter, completed=False, **task_data.dict())
#     _fake_db.append(task)
#     _id_counter += 1
#     return task


# def get_all_tasks() -> List[Task]:
#     return _fake_db

# def delete_task(id:int)-> None:
#     return _fake_db.pop(id)

# def update_task(id:int, task_data: TaskCreate)-> Task:
#     task = _fake_db[id]
#     task.title = task_data.title
#     task.description = task_data.description
#     return task