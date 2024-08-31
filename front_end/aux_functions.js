

const encrypt_file_button_callback = (code, n, key, path, callback ) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch("http://127.0.0.1:5010/encrypt_file", {
        method: "POST",
        body: JSON.stringify({
            "path": path + "/" + n,
            "folder_key": key_get_info.value,
            "key": key,
            "code": code
        }),
        headers: myHeaders,
    }).then(response => response.json())
        .then(data => {
            callback(data);
        });
}