const table = document.getElementsByClassName("block")
let next = "X"
let game = [0, 0, 0, 0, 0, 0, 0, 0, 0]
let resets = [document.getElementById("resets"), 0]
let winCounter = [0,0,0]

let win = [
    document.getElementById("top").children,
    document.getElementById("middle").children,
    document.getElementById("bottom").children
]

function reset() {
    resets[1]+=1
    game = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    next = "X"
    for (let index = 0; index < table.length; index++) {
        table[index].firstChild.textContent = ""        
    }
}

function save(play) {
    select = 0
    if (play == "X") {
        select = 1
    } else if (play == "O") {
        select = -1
    }
    return select
    
}

function winner(data) {
    firstLine = data[0] + data[1] + data[2] == 3 || data[0] + data[1] + data[2] == -3
    secondLine = data[3] + data[4] + data[5] == 3 || data[3] + data[4] + data[5] == -3
    thirtLine = data[6] + data[7] + data[8] == 3 || data[6] + data[7] + data[8] == -3
    firstDown = data[0] + data[3] + data[6] == 3 || data[0] + data[3] + data[6] == -3
    secondDown = data[1] + data[4] + data[7] == 3 || data[1] + data[4] + data[7] == -3
    thirtDown = data[2] + data[5] + data[8] == 3 || data[2] + data[5] + data[8] == -3
    firstXline = data[0] + data[4] + data[8] == 3 || data[0] + data[4] + data[8] == -3
    secondXline = data[2] + data[4] + data[6] == 3 || data[2] + data[4] + data[6] == -3
    condition = firstLine || secondLine || thirtLine || firstDown || secondDown || thirtDown || firstXline || secondXline
    if (condition) {
        return [condition,next,[firstLine, secondLine, thirtLine, firstDown, secondDown, thirtDown, firstXline, secondXline]]
    }
}

function verify() {

    for (let index = 0; index < table.length; index++) {
        const element = table[index].firstChild.textContent;
        game[index] = save(element)
        
    }
    return winner(game)
}

function wins(data) {
    let winnerData = winner(data)
    if (winnerData) {
        return winnerData[2].filter(Boolean).length
    }
}

function nextPlayer(data) {
    if (data == "X") {
        return "O"
    } else {
        return "X"
    }
}


function yourWinChance(data) {
    saveData = [0,0,0,0,0,0,0,0,0]
    for (i in data) {
        if (data[i] == 0) {
            saveData[i] = save(next)
        } else{saveData[i] = data[i]}
    }
    return wins(saveData)

}

function rivalWinChance(data) {
    saveData = [0,0,0,0,0,0,0,0,0]
    let rival
    rival = nextPlayer(next)
    for (i in data) {
        if (data[i] == 0) {
            saveData[i] = save(rival)
        } else{saveData[i] = data[i]}
    }
    return wins(saveData)
}

function nextRivalPlay(data) {
    let localTable = [[],[]]
    for (i in data) {
        localTable[0] = []
        for (e of data) {
            localTable[0].push(e)
        }
        if (localTable[0][i] == 0) {
            localTable[0][i] = save(next)
        }
        if (winner(localTable[0])) {
            localTable[1].push(-10)
        } else {localTable[1].push(10)}
    }
    return localTable
}


function maxPosition(data) {
    positions = []
    maxNumber = -10
    for (i of data) {
        if (i >= maxNumber) {
            maxNumber = i
        }
    }
    for (i in data) {
        if (data[i] == maxNumber) {
            positions.push(i)
        }
    }
    return positions
}


function nextPlay(data) {
    let localTable = [[],[]]
    for (i in data) {
        localTable[0] = []
        for (e of data) {
            localTable[0].push(e)
        }
        if (localTable[0][i] == 0) {
            localTable[0][i] = save(nextPlayer(next))
        }
        let myChance = yourWinChance(localTable[0])
        let rivalChance = rivalWinChance(localTable[0])
        if (nextRivalPlay(localTable[0])[1].indexOf(-10) != -1) {
            return nextRivalPlay(localTable[0])[1].indexOf(-10)
        }
        
        localTable[1].push((-myChance + rivalChance))
    }
    return maxPosition(localTable[1])
}

function selectTable(firstData, data) {
    setTimeout(() => {
        firstData[data].click()
    }, 0);
    return 
}

function choice(data) {
    selection = data
    posibleSelection = []
    if (data.length > 1) {
        randomNumber = Math.floor(Math.random() * data.length) 
        selection = data[randomNumber]
    }

    if (table[selection].firstChild.textContent) {
        for (i of table) {
            if (!i.firstChild.textContent) {
                posibleSelection.push(i)
            }
        }
        randomNumber = Math.floor(Math.random() * posibleSelection.length) 
        selection = randomNumber
    } else { posibleSelection = table }
    selectTable(posibleSelection, selection)
}

function randomSelect() {
    now = []
    for (i of table) {
        if (!i.firstChild.textContent) {
                now.push(i)
        }
    }
    randomSel = Math.floor(Math.random() * now.length)
    now[randomSel].click()
}
function draw() {
    data = 0
    for (i of table) {
        if (i.firstChild.textContent) {
            data+=1
        }
    }
    if (data == 9) {
        return true
    }
}


function change(params) {
    if (params.srcElement.firstChild.innerHTML) {
        return
    }
    params.srcElement.firstChild.innerHTML = next
    if (draw()) {
        winCounter[2]+=1
        reset()
        if (resets[1] == resets[0].value) {
            console.log(winCounter)
            return
        }
    }



    let theWinner = verify()
    if (theWinner) {
        console.log('Ganador: ' + next)
        if (next == "X") {
            winCounter[0]+=1
        } else {winCounter[1]+=1}
        reset()
        if (resets[1] == resets[0].value) {
            console.log(winCounter)
            return
        }
    }
    try {
        choice(nextPlay(game))
    } catch (error) {
        randomSelect()
    }
    
    next = nextPlayer(next)
}

for (const key of table) {
    key.addEventListener("click", (e) => (
        change(e)
    ))
}