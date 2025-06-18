from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .tasks.api import router as tasks_router
from .database import create_tables

app = FastAPI(title="Task Manager")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # URL вашего Vue приложения
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await create_tables()

app.include_router(tasks_router)
