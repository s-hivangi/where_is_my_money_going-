from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.upload import router as upload_router

app = FastAPI(title="Finance Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Backend is running"}
