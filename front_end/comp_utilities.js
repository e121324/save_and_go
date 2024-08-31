
const retrieve_dir_data = async (direc, key) => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let response = await fetch("http://127.0.0.1:5010/get_dir_info", {
        method: "POST",
        body: JSON.stringify({
            "directory": direc,
            "key": key
        }),
        headers: myHeaders,
    });

    return await response.json();
}

const retrieve_files_data = async (direc, key) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let response = await fetch("http://127.0.0.1:5010/get_files_info", {
        method: "POST",
        body: JSON.stringify({
            "directory": direc,
            "key": key
        }),
        headers: myHeaders,
    });

    return await response.json();
}

const get_table_head = for_dir => {
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");

    let aux = content => {
        let th = document.createElement("th");
        th.textContent = content;
        th.setAttribute("scope", "col");
        tr.appendChild(th);
    }

    ["#", "Name", "", ""].forEach(aux);

    if (for_dir)
        aux("")

    thead.appendChild(tr);
    return thead
}

let get_button = (style, text, disabled = false) => {
    let td = document.createElement("td");
    td.setAttribute("style", "width: 10%;");
    let button = document.createElement("button");
    button.textContent = text;
    button.setAttribute("type", "button");
    button.setAttribute("class", style);
    td.appendChild(button);

    button.disabled = disabled;

    // button.addEventListener("click", callback);

    return td
}

const get_table_row = (for_dir, code, n, key, path, encrypted, top_key ) => {

    let tr = document.createElement("tr"),
        th = document.createElement("th"),
        td = document.createElement("td");

    th.setAttribute("scope", "row");
    th.setAttribute("style", "width: 5%;");
    th.textContent = code

    tr.appendChild(th);

    td.textContent = n

    tr.appendChild(td)

    let b3 = get_button("btn btn-info", "Get info", !encrypted);
    if (for_dir) {
        tr.appendChild(b3);

        b3.children[0].addEventListener("click", () => {
            console.log(key)
            get_info( path + "/" + code, key, td, true)
        });
    }

    let b1 = get_button("btn btn-danger", "Encrypt", encrypted);
    tr.appendChild(b1);
    let b2 = get_button("btn btn-success", "Decrypt", !encrypted);
    tr.appendChild(b2);

    b1.children[0].addEventListener("click", () => {
        console.log("Encrypting with key: ", key);
        b1.children[0].disabled = true;

        const answer = data => {
            console.log(data);
            b2.children[0].disabled = false;
            b3.children[0].disabled = false
        }

        for_dir ?
            encrypt_directory_button_callback(code, n, key, path, answer)
            :
            encrypt_file_button_callback(code, n, key, path, top_key, answer);
        });


    console.log( "Finding the path:", path);
    b2.children[0].addEventListener("click", () => {
        console.log("Decrypting with key: ", key);
        b2.children[0].disabled = true;

        const answer = data => {
            console.log(data);

            if(for_dir)        // Restart options :) to prevent unexpected behaviour
                td.innerHTML = n;

            b1.children[0].disabled = false;
            b3.children[0].disabled = true;
        }

        for_dir ?
            decrypt_directory_button_callback(code, n, key, path, answer)
            :
            decrypt_file_button_callback(code, key, path, top_key, answer);

    });


    return tr;
}

const element_in_array = (elem, arr) => {
    for(let i = 0; i < arr.length; ++i) {
        if(elem === arr[i])
            return true;
    }
    return false;
}

const get_table_body = (data, for_dir, top_key) => {
    let tbody = document.createElement("tbody");

    for(let i = 0; i < data.info.length; ++i) {
        tbody.appendChild(get_table_row(for_dir, data.info[i].code, data.info[i].name, data.info[i].key, data.path, !element_in_array(  for_dir ? "d" + i.toString() : i.toString(), data.changes), top_key));
    }

    return tbody;
}

const get_table = (data, for_dir, top_key) => {
    let table = document.createElement("table"),
        thead = get_table_head(for_dir),
        tbody = get_table_body(data, for_dir, top_key);

    table.setAttribute("class", "table");
    table.appendChild(thead);
    table.appendChild(tbody);

    return table
}

const display_dir_info = (element, res_dir, res_files, top_key, append = false) => {
    if(append){
        let p = document.createElement("p");
        p.textContent = "Directory content:";
        element.appendChild(p)
        element.appendChild( document.createElement("br"));
    } else
        element.innerHTML = "<p>Directory content:</p> <br>";

    if(res_files.status === "ok"){
        let p = document.createElement("p");
        p.textContent = "Files";
        element.appendChild(p);
        element.appendChild(get_table(res_files.data, false, top_key));
    } else if (res_files.status !== "warning") {
        appendAlert(res_files.msg, "danger");
    }

    if(res_dir.status === "ok"){
        let p = document.createElement("p");
        p.textContent = "Nested directories";
        element.appendChild(p);
        element.appendChild(get_table(res_dir.data, true, top_key));
    } else if (res_dir.status !== "warning"){
        appendAlert(res_dir.msg, "danger");
    }
}


const get_info = async (directory, key, container, append = false) => {
    let res_dir = await retrieve_dir_data(directory, key);

    let res_files = await retrieve_files_data(directory, key);

    display_dir_info(container, res_dir, res_files, key, append);
    console.log(res_dir, res_files);
    console.log(res_dir.data.info[0].key);

}
