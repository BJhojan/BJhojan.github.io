let proposition = document.getElementById("proposition")
let buttons = document.getElementById("connectors")
let globalTable = document.getElementById("table")
let text
let titleList
let op = [["p", "q", "r", "s", "t", "u"],0]
let info = []
let titles = []
let localInfo = [0]
let title,content,titleTr,newTable,indexPar,sendInfo,globalInfo
let table = []
let p, q, r, s, t, u
let propositions,firstData
function trueFalses(max) {
    if (max <1) {
        return "-"
    }
    return Array(max).fill(true).concat(Array(max).fill(false))
}

function tableAppend() {
    globalTable.innerHTML = ""
    titleTr = document.createElement("tr")
        for (i in titles) {
        title = document.createElement("th")
        title.appendChild(document.createTextNode(titles[i]))
        titleTr.appendChild(title)
    }
    newTable = []
    console.log(tableData)
    for (i in tableData[0]) {
        localInfo = []
        for (e in tableData) {
            
            localInfo.push(tableData[e][i])
        }
        newTable.push(localInfo)
        localInfo = [0]
    }
    
    globalTable.appendChild(titleTr)
    for (i of newTable) {
        content = document.createElement("tr")
        for (e of i) {
            cell = document.createElement("td")
            cell.appendChild(document.createTextNode(e))
            content.appendChild(cell)
            globalTable.appendChild(content)
        }
    }
    propositions = {
        "p": p,
        "q": q,
        "r": r,
        "s": s,
        "t": t,
        "u": u
    }
}

function saveInfo(data) {
    let repeat = 2 ** op[1]
    info.push(data)
    p = []
    p = [].concat(...[trueFalses(repeat / 2)])
    if (p.length < 4) {
        return [p]
    }
    q = []
    while (p.length > q.length) {
        q.push([].concat(...[trueFalses(repeat / 4)]))
    }
    q = [].concat(...q).slice(0,p.length)
    if (p.length < 8) {
    return [p, q]
    }
    r = []
    while (p.length > r.length) {
        r.push([].concat(...[trueFalses(repeat / 8)]))
    }
    r = [].concat(...r).slice(0,p.length)
    if (p.length < 16) {
    return [p, q,r]
    }
    s = []
    while (p.length > s.length) {
        s.push([].concat(...[trueFalses(repeat / 16)]))
    }
    s = [].concat(...s).slice(0,p.length)
    if (p.length < 32) {
    return [p, q,r,s]

    }
    t = []
    while (p.length > t.length) {
        t.push([].concat(...[trueFalses(repeat / 32)]))
    }
    t = [].concat(...t).slice(0,p.length)
    if (p.length < 64) {
    return [p, q,r,s,t]

    }
    u = []
    while (p.length > u.length) {
        u.push([].concat(...[trueFalses(repeat / 64)]))
    }
    u = [].concat(...u).slice(0,p.length)
    return [p, q,r,s,t,u]
}

function not(data,name) {
    let i = data
    data = []
    for (i of i) {
        data.push(!i)
    }
    return ["-"+name,data]
}


p = [
    true,
    true,
    false,
    false
]
q = [
    true,
    false,
    true,
    false
]


function dataAnalisis(data) {
    let A = data[0]
    let C = data[1]
    let B = data[2]
    let R = []
    
    
    

    for (i in A) {

        if (C == "Ʌ") {
            R.push(A[i] && B[i])
        }
        if (C == "V") {
            R.push(A[i] || B[i])
        }
        if (C == "→") {
            R.push(!A[i] || B[i])
        }
        if (C == "↔") {
            R.push(A[i] == B[i])
        }
    }
    return R


    
    
    
    
}



function preposition(data=document.querySelector("#proposition").textContent) {
    data = data.split(/[\(\)]/)
    localInfo = [0, [], true, {
    "↔":false,
    "→":false,
    "V":false,
    "Ʌ":false
    },true]
    let temporal = [[],[]]
    data = data.filter(Boolean)
    for (i of data) {
        temporal[1].push(i)
        for (i of i) {
            if (i in propositions) {
                if (localInfo[3]) {
                    temporal[0].push(propositions[i])
                } else {
                    propositions["-"+i] = []
                    for (e of propositions[i]) {
                        propositions["-" + i].push(!e)
                        localInfo[3] = true
                    }
                    temporal[0].push(propositions["-" + i])
                }
            } else if (i == "-") {
                localInfo[3] = false
            } else {
                temporal[0].push(i)
            }
        }
    }
    for (e in temporal[1]) {
        temporal[0][0] = dataAnalisis(temporal[0])
        temporal[0].splice(1, 2)
        if (data[e].match(/[pqrstu]/g)) {
            propositions[data[e]] = [].concat(...temporal[0])
            propositions[data[e]].slice(0,propositions["p"].length)
        }
    }
    propositions[data] = [].concat(...temporal[0])
    temporal = Object.entries(propositions)
    console.log(temporal)
    titles = []
    tableData = []
    for (i in temporal) {
        if (!temporal[i][1]) {
            continue
        }
        titles.push(temporal[i][0])
        tableData.push(temporal[i][1])
    }
    tableAppend()
}

function setInternal(data) {
    tableData = []
    if (data == "(") {
        localInfo[0] += 1
    } else if (localInfo[0] == 0) {
        tableData = saveInfo(data)
        tableAppend()
        return
    } else if (data == ")") {
        localInfo[0] -= 1
    }
    
    localInfo.push(data)
    if (localInfo[0] == 0) {
        tableData = saveInfo(localInfo)
        tableAppend()
        localInfo = [0]
    }
}

function propositionModify(data) {
    setInternal(data.innerText)
    proposition.appendChild(data)
    preposition()
    tableAppend()
}

document.getElementById("delete").addEventListener("click", (e) => {
    if (proposition.lastChild) {
        info.pop()
        proposition.lastChild.remove()
    }
})


function add(data) {
    if (op[0].includes(data.srcElement.innerText)) {
        titles.push(op[0].splice(0, 1))
        if (op[0] != 0 || op[1] < 32) {
            op[1] += 1
        }
        if (op[0] != 0) {
            newName = op[0][op[0].indexOf(data.srcElement.innerText) + 1]
            newElement = document.createElement("button")
            newElement.textContent = newName
            newElement.addEventListener("click",(e)=>{add(e)})
            document.getElementById("p").append(newElement)
        }
    }
    p = document.createElement("p")
    p.textContent = data.srcElement.innerText
    propositionModify(p)
}

for (const i of buttons.children) {
    if (i["tagName"] == "DIV") {
        for (const e of i.children) {
            e.addEventListener("click",(d)=>{add(d)})
        }
    } else {
        i.addEventListener("click",(d)=>{add(d)})
    }
}