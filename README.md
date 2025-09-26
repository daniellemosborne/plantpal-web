# Plant Pal

Identify plants from a photo and get quick facts in seconds.

**Live app:** https://plantpal-web.vercel.app/ 

Plant Pal is a full-stack image classification app:
- **Frontend:** Vite + React + TypeScript (deployed on **Vercel**)
- **Backend:** **Flask** API serving a **Keras/TensorFlow** model (deployed on **Cloud Run**)
- **Model storage:** **Google Cloud Storage** (downloaded at boot via `MODEL_URL`)

### Features
- Upload an image and get top prediction + confidence (with top candidates).
- Client/server confidence thresholds with “Unknown” handling.
- Helpful info panel with concise plant care/use notes.
- Clean, responsive UI with drag-and-drop uploads and sample image.

### Tech
React, TypeScript, Vite, Flask, TensorFlow/Keras, Python, Docker, Cloud Run, Vercel.
