

const encrypt_file_button_callback = (code, n, key, path, top_key, callback ) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch("http://127.0.0.1:5010/encrypt_file", {
        method: "POST",
        body: JSON.stringify({
            "path": path + "/" + n,
            "folder_key": top_key,
            "key": key,
            "code": code
        }),
        headers: myHeaders,
    }).then(response => response.json())
        .then(data => {
            if(data.status !== "ok"){
                appendAlert(data.msg, "danger");
            } else
                callback(data);
        });
}

const decrypt_file_button_callback = (code, key, path, top_key, callback) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch("http://127.0.0.1:5010/decrypt_file", {
        method: "POST",
        body: JSON.stringify({
            "path": path + "/" + code,
            "folder_key": top_key,
            "key": key
        }),
        headers: myHeaders,
    }).then(response => response.json())
        .then(data => {
            if(data.status !== "ok"){
                appendAlert(data.msg, "danger");
            } else
                callback(data);
        });

}

const encrypt_directory_button_callback = (code, n, key, path, callback) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch("http://127.0.0.1:5010/encrypt_dir", {
        method: "POST",
        body: JSON.stringify({
            "directory": path + "/" + n,
            "key": key,
            "new_name": code
        }),
        headers: myHeaders,
    }).then(response => response.json())
        .then(data => {
            if(data.status !== "ok"){
                appendAlert(data.msg, "danger");
            } else
                callback(data);
        });
}

const decrypt_directory_button_callback = (code, n, key, path, callback) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch("http://127.0.0.1:5010/decrypt_dir", {
        method: "POST",
        body: JSON.stringify({
            "directory": path + "/" + code,
            "key": key,
            "new_name": n
        }),
        headers: myHeaders,
    }).then(response => response.json())
        .then(data => {
            if(data.status !== "ok"){
                appendAlert(data.msg, "danger");
            } else
                callback(data);
        });
}