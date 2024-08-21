from flask import Flask, jsonify, request
from files_tools import encrypt_directory, decrypt_directory, load_data, decrypt_file
import ntpath
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

@app.route("/get_dir_info", methods=["POST"])
def info_1():
    req = request.get_json()

    direc = req["directory"]
    key = req["key"]
    print("Getting directory info: ", direc)

    dir_data = load_data(direc, key, ".dir", destroy=False)

    response = {"PATH": direc}
    for i in range(0, len(dir_data), 2):
        response[dir_data[i+1]] = { "name": f"d{i // 2}", "key": dir_data[i]}

    return jsonify(response)

@app.route("/get_files_info", methods=["POST"])
def info_2():
    req = request.get_json()

    direc = req["directory"]
    key = req["key"]
    print("Getting files info: ", direc)

    keys = load_data(direc, key, ".keys", destroy=False)

    response = {"PATH": direc}
    for i in range(len(keys)):
        response[str(i)] = {"name": decrypt_file(keys[i], directory=direc, name=str(i), rewrite=False, name_only=True), "key": keys[i]}

    return jsonify(response)

@app.route("/decrypt_file", methods=["POST"])
def decrypt_2():
    req = request.get_json()

    folder_key = req["key"]
    path = req["path"]

    direc, file = ntpath.split(path)
    if not file:
        file = ntpath.basename(direc)

    print("Decrypting file: ", direc, file)

    key = load_data(direc, folder_key, ".keys", destroy=False)[int(file)]

    decrypt_file(key, directory=direc, name=file)

    return jsonify({"message": "File decrypted"})

if __name__ == "__main__":
    app.run(port=5010, debug=True)