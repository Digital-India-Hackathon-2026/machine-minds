from fastapi import APIRouter, UploadFile, File
import shutil
import os

from services.frame_extractor import extract_frames
from services.face_detector import detect_faces

router = APIRouter()

UPLOAD_DIR = "uploads"
FRAME_DIR = "reports/frames"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(FRAME_DIR, exist_ok=True)


@router.post("/upload")
async def upload_video(video: UploadFile = File(...)):

    # Save uploaded video
    filepath = os.path.join(
        UPLOAD_DIR,
        video.filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(
            video.file,
            buffer
        )

    # Create folder for extracted frames
    frames_folder = os.path.join(
        FRAME_DIR,
        video.filename.split(".")[0]
    )

    # Extract frames
    total_frames = extract_frames(
        filepath,
        frames_folder
    )

    # Detect faces in first frame
    sample_frame = os.path.join(
        frames_folder,
        "frame_0.jpg"
    )

    faces_found = 0

    if os.path.exists(sample_frame):
        faces_found = detect_faces(
            sample_frame
        )

    return {
        "message": "Video uploaded successfully",
        "filename": video.filename,
        "frames_extracted": total_frames,
        "faces_detected": faces_found
    }