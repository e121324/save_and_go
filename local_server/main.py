from flask import Flask, jsonify, request
from files_tools import (encrypt_directory, decrypt_directory,
                         load_data, decrypt_file, store_data, already_encrypted,
                         are_dir_encrypted, are_files_encrypted)
import ntpath
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# TODO: FileExistsError:
#  * [WinError 183] No se puede crear un archivo que ya existe

@app.route("/encrypt_dir", methods=["POST"])
def encrypt_1():
    req = request.get_json()

    direc = req["directory"]
    key = req["key"]
    new_name = req["new_name"]

    print("Encrypting directory: ", direc)

    try:
        if already_encrypted(direc):
            return jsonify({
                "status": "err",
                "msg": "Directory already encrypted"
            })

        key = encrypt_directory(direc, key=key, new_name=new_name)
        response = jsonify({
            "status": "ok",
            "key": key
        })
    except Exception as e:
        print(e)
        response = jsonify({
            "status": "err",
            "msg": str(e)
        })

    return response


@app.route("/decrypt_dir", methods=["POST"])
def decrypt_1():
    req = request.get_json()

    direc = req["directory"]
    key = req["key"]
    new_name = req["new_name"]
    print("Decrypting directory: ", direc)
    try:
        decrypt_directory(direc, key, new_name=new_name)
        response = jsonify({
            "status": "ok",
            "message": "Decryption complete"
        })
    except Exception as e:
        print(e)
        response = jsonify({
            "status": "err",
            "msg": str(e)
        })

    return response


@app.route("/get_dir_info", methods=["POST"])
def info_1():
    req = request.get_json()

    direc = req["directory"]
    key = req["key"]
    print("Getting directory info: ", direc)

    try:
        if not are_dir_encrypted(direc):
            return jsonify({
                "status": "warning",
                "msg": "No directories encrypted"
            })
        dir_data = load_data(direc, key, ".dir", destroy=False)
        print(dir_data)

        response = {"PATH": direc, "changes": [], "info": []}
        for i in range(0, len(dir_data), 2):

            response["info"].append({
                "name": dir_data[i + 1],
                "code": f"d{i // 2}",
                "key": dir_data[i]
            })

            if not os.path.isdir(direc + "/" + f"d{i // 2}"):
                response["changes"].append(f"d{i // 2}")

        return jsonify({
            "status": "ok",
            "data": response
        })
    except Exception as e:
        return jsonify({
            "status": "err",
            "msg": str(e)
        })


@app.route("/get_files_info", methods=["POST"])
def info_2():
    req = request.get_json()

    direc = req["directory"]
    key = req["key"]
    print("Getting files info: ", direc)

    try:
        if not are_files_encrypted(direc):
            return jsonify({
                "status": "warning",
                "msg": "No files encrypted"
            })

        keys = load_data(direc, key, ".keys", destroy=False)

        changes = load_data(direc, key, ".changes", destroy=False) if os.path.isfile(direc + "/" + ".changes") else []
        print(changes)
        response = {"PATH": direc,
                    "changes": changes,
                    "info": []}
        for i in range(len(keys)):
            response["info"].append({
                "name": changes[changes.index(str(i)) + 1] if (str(i) in changes) else decrypt_file(keys[i],
                                                                                                    directory=direc,
                                                                                                    name=str(i),
                                                                                                    rewrite=False,
                                                                                                    name_only=True),
                "code": str(i),
                "key": keys[i]
            })

        return jsonify({
            "status": "ok",
            "data": response
        })
    except Exception as e:
        return jsonify({
            "status": "err",
            "msg": str(e)
        })


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

    new_name = decrypt_file(key, directory=direc, name=file)

    data = [file, new_name] + (
        load_data(direc, folder_key, ".changes") if os.path.isfile(direc + "/" + ".changes") else [])
    store_data(data, direc, ".changes", folder_key)

    # print(load_data(direc, folder_key, ".changes", destroy=False))

    return jsonify({"message": "File decrypted"})


if __name__ == "__main__":
    app.run(port=5010, debug=True)
