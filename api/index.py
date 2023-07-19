from fastapi import FastAPI

# from api.app import search_image, search_prompt, get_home_images

app = FastAPI()


@app.get("/api/health-check")
def health_check():
    return {"status": "ok"}
