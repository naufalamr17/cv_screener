import webview
import threading
import uvicorn
import sys
import os

# Add the current directory to sys.path to ensure imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app

def start_server():
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="error")

if __name__ == '__main__':
    # Start the server in a separate thread
    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()

    # Create a webview window
    webview.create_window('CV Screening AI', 'http://127.0.0.1:8000', width=1200, height=800)
    webview.start()
