from flask import Flask, jsonify, request
from files_tools import encrypt_directory, decrypt_directory

app = Flask(__name__)

@app.route("/encrypt_dir", methods=["POST"])
def encrypt_1():

    req = request.get_json()

    direc = req["directory"]
    print("Encrypting directory: ", direc)
    key = encrypt_directory(direc)
    response = jsonify({
        "key": key
    })

    return response

@app.route("/decrypt_dir", methods=["POST"])
def decrypt_1():

    req = request.get_json()

    direc = req["directory"]
    key = req["key"]
    print("Decrypting directory: ", direc)
    decrypt_directory(direc, key)
    response = jsonify({
        "message": "Decryption complete"
    })

    return response

if __name__ == "__main__":
    app.run(debug=True)