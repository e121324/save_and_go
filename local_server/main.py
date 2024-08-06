from flask import Flask

app = Flask(__name__)

@app.route("/")
def base_test():
    return "test?!"