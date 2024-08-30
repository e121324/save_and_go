
const retrieve_dir_data = async (direc, key) => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let response = await fetch("http://127.0.0.1:5010/get_dir_info", {
        method: "POST",
        body: JSON.stringify({
            "directory": direc,
            "key": key,
            "new_name": ""
        }),
        headers: myHeaders,
    })

    return await response.json();

};