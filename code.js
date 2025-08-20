input = document.querySelector("#data")

document_list = []

function appendTable(data) {
    tr = document.createElement("tr")
    tdl = document.createElement("td")
    tdr = document.createElement("td")
    tdl.innerHTML = document_list.length + 1
    tdr.innerHTML = data
    tr.appendChild(tdl)
    tr.appendChild(tdr)
    document.querySelector("body > div:nth-child(2) > table > tbody").appendChild(tr)
    document_list.push([document_list.length + 1, data])
}
group = []


function subSet(data) {
    i = 0
    new_data = []
    repeat = 0
    bucle = 0
    len = data.length
    s = 0
    while (new_data.length+1 < 2 ** len) {
        s++
        if (typeof (data[i]) == "object") {
            d = data[i].join(",")
        } else { d = data[i] }
        if (repeat == len) {
            repeat = 0
        }
        if (repeat == i) {
            new_data.push(d)
        } else {
            if (repeat == 0) {
                bucle++
            }
            
            info = [new_data[bucle - 1], data[repeat]].sort().join(",")
            info = info.split(",").sort().join(",")
            if (!new_data.includes(info) && !(info.slice(info.indexOf(",")+1)==info.slice(0,info.indexOf(","))) && !(new_data[bucle - 1].includes(data[repeat]))) {
                new_data.push(info)
            } else {
                repeat++
                i++
                continue
            }
        }
        i++
        repeat++
    }
    console.log(s)
    new_data.unshift("[ ]")
    return new_data
}

// 1
// Creacion de elementos
function groups(data) {
    group = []
    for (const e of data) {
        if (e[1] == "[ ]"  || data[e[0]] == undefined) {
            continue
        }
        

    }
    for (const e of group) {
        appendTable(e)
    }
}



// 2
// evento 
input.addEventListener("input", () => {
    document_list = []
    document.querySelector("body > div:nth-child(2) > table > tbody").innerHTML = ""
    data = input.value.split(",")
    for (const i of subSet(data)) {
        if (i == "" || i[0] == ",") {
            continue
        }
        appendTable(i)
    }
    groups(document_list)
    if (data == "") {
        document.querySelector("#result").innerHTML = (1)
    } else {
        document.querySelector("#result").innerHTML = (2 ** data.length)
    }
})