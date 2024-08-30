
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

    ["#", "name", "", ""].forEach(aux);

    if (for_dir)
        aux("")

    thead.appendChild(tr);
    return thead
}


/* test info
[
    {
        "code": "d0",
        "key": "gf5+hbDcedLZL458975wvkVWfZB40/Y5G5/NLrcZGSo=",
        "name": "leo"
    },
    {
        "code": "d1",
        "key": "mpZ1gWdQhNLHALeXNiDRmbFPpk7Pjr1u0y7dP0dWqEw=",
        "name": "leoleo"
    }
]
 */


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

const get_table_row = (for_dir, code, n, key, path ) => {


    let tr = document.createElement("tr"),
        th = document.createElement("th"),
        td = document.createElement("td");

    th.setAttribute("scope", "row");
    th.setAttribute("style", "width: 5%;");
    th.textContent = code

    tr.appendChild(th);

    td.textContent = n

    tr.appendChild(td)

    if (for_dir) {
        tr.appendChild(get_button("btn btn-info", "Get info"));
    }

    let b1 = get_button("btn btn-danger", "Encrypt", true);
    tr.appendChild(b1);
    let b2 = get_button("btn btn-success", "Decrypt");
    tr.appendChild(b2);

    b1.children[0].addEventListener("click", () => {
        console.log("Encrypting with key: ", key);
        b1.children[0].disabled = true;
        b2.children[0].disabled = false
    });
    b2.children[0].addEventListener("click", () => {
        console.log("Decrypting with key: ", key);
        b2.children[0].disabled = true;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch("http://127.0.0.1:5010/decrypt_file", {
            method: "POST",
            body: JSON.stringify({
                "path": path + "/" + code,
                "key": key_get_info.value
            }),
            headers: myHeaders,
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                b1.children[0].disabled = false;
            });

    });


    return tr;
}

const get_table_body = (data, for_dir) => {
    let tbody = document.createElement("tbody");

    for(let i = 0; i < data.info.length; ++i) {
        tbody.appendChild(get_table_row(for_dir, data.info[i].code, data.info[i].name, data.info[i].key, data.path));
    }

    return tbody;
}

const get_table = (data, for_dir) => {
    let table = document.createElement("table"),
        thead = get_table_head(for_dir),
        tbody = get_table_body(data, for_dir);

    table.setAttribute("class", "table");
    table.appendChild(thead);
    table.appendChild(tbody);

    return table
}

const display_dir_info = (element, res_dir, res_files) => {
    element.innerHTML = "<p>Directory content:</p> <br>";

    if(res_files.status === "ok"){
        let p = document.createElement("p");
        p.textContent = "Files";
        element.appendChild(p);
        element.appendChild(get_table(res_files.data, false));
    }

    if(res_dir.status === "ok"){
        let p = document.createElement("p");
        p.textContent = "Nested directories";
        element.appendChild(p);
        element.appendChild(get_table(res_dir.data, true));
    }
}