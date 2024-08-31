from waitress import serve
from local_server.main import app
import webbrowser
import os


webbrowser.open("file:///" + os.getcwd() + "/front_end/main.html")

# waitress-serve --host 127.0.0.1 --port=5010 local_server.main:app
serve(app, host='127.0.0.1', port=5010)
