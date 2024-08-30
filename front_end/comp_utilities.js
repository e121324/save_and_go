
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


let get_button = (style, text, callback) => {
    let td = document.createElement("td");
    td.setAttribute("style", "width: 10%;");
    let button = document.createElement("button");
    button.textContent = text;
    button.setAttribute("type", "button");
    button.setAttribute("class", style);
    td.appendChild(button);

    return td
}

const get_table_row = (for_dir, code, n, key ) => {


    let tr = document.createElement("tr"),
        th = document.createElement("th"),
        td1 = document.createElement("td"),
        td2 = document.createElement("td"),
        td3 = document.createElement("td");

    th.setAttribute("scope", "row");
    th.setAttribute("style", "width: 5%;");
    th.textContent = code

    tr.appendChild(th);

    td1.textContent = n

    tr.appendChild(td1)

    if (for_dir) {

        tr.appendChild(td2)
    }

    td2.setAttribute("style", "width: 10%;");
    let button1 = document.createElement("button");
    button1.textContent = "Encrypt";
    button1.setAttribute("type", "button");
    button1.setAttribute("class", "btn btn-success");
    td2.appendChild(button1);

    tr.appendChild(td2)

    td3.setAttribute("style", "width: 10%;");
    let button2 = document.createElement("button");
    button2.textContent = "Decrypt";
    button2.setAttribute("type", "button");
    button2.setAttribute("class", "btn btn-danger");
    button2.disabled = true;
    td3.appendChild(button2);

    tr.appendChild(td3)

    return th;
}

const get_table_body = (info, for_dir) => {
    let tbody = document.createElement("tbody");

    for(let i = 0; i < info.length; ++i) {

    }
}

const get_table = (info, for_dir) => {
    let table = document.createElement("table"),
        thead = get_table_head(for_dir);
    table.setAttribute("class", "table");


    table.appendChild(thead);



    console.log(table);
}

const display_dir_info = (element, res_dir, res_files) => {
    element.innerHTML = "<p>Directory content:</p> <br>";


}