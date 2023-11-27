let test
// Gerar Listas

    const generateMonsterList = () => {
        let challengeRating = document.querySelector('#dificulty')
        let challengeURL = ''
        if(challengeRating.value){
            challengeURL = '?challenge_rating=' + challengeRating.value
        }

        let request = new XMLHttpRequest()
        request.open('GET', 'https://www.dnd5eapi.co/api/monsters' + challengeURL)
        request.responseType = 'json'
        request.send()
        console.log('Request sended')

        request.onload = () => {
            console.log('Request loaded')
            console.log(request.response.results)
            generateList(request.response.results)
        }
    }

    const generateList = (monsterList) => {
        let monsterListTag = document.querySelector('#monster-list')
        monsterListTag.innerHTML = '<option value="" disabled selected>Selecionar monstro</option>'
        console.log('Gerando lista')
        monsterList.map((monster) => {
            monsterListTag.innerHTML += `<option value="${monster.index}">${monster.name}</option>`
        })
    }

// Gerar Ficha

    const generateMonsterCard = () => {
        let monsterSelected = document.querySelector('#monster-list')

        let request = new XMLHttpRequest()
        request.open('GET', 'https://www.dnd5eapi.co/api/monsters/' + monsterSelected.value)
        request.responseType = 'json'
        request.send()
        console.log('Request sended')

        request.onload = () => {
            console.log('Generating card')
            generateMonster(request.response)
        }
    }

    const generateMonster = (monster) => {
        test = monster
        console.log(monster)
        let container = document.querySelector('section')
        container.innerHTML = `<div class="ficha">
        <div class="describe">
            <p class="name">${monster.name}</p>
            <small>${monster.size} ${monster.type}, ${monster.alignment}</small>
            <small>Subtype: ${monster.subtype}</small>
        </div>
        <div class="vitality">
            <div class="life">HP: ${monster.hit_points} &nbsp; (${monster.hit_points_roll})</div>
            <div class="armor">CA: ${monster.armor_class[0].value}</div>
        </div>
        <div class="speed">
            Speed:
            ${obj(monster.speed)}
            
        </div>
        <table>
            <tr>
                <td>STR</td>
                <td>DEX</td>
                <td>CON</td>
                <td>INT</td>
                <td>WIS</td>
                <td>CHA</td>
            </tr>
            <tr>
                <td class="str">${monster.strength}</td>
                <td class="dex">${monster.dexterity}</td>
                <td class="con">${monster.constitution}</td>
                <td class="int">${monster.intelligence}</td>
                <td class="wis">${monster.wisdom}</td>
                <td class="cha">${monster.charisma}</td>
            </tr>
        </table>
        <hr>
        <div class="addicional">
            <div class="proficiencies">
                <b>Proficiencies:</b>
                ${prof(monster.proficiencies)}
            </div>
            <div class="combat-area">
                ${excludeNull(monster, list, "damage_vulnerabilities")}
                ${excludeNull(monster, list, "damage_resistances")}
                ${excludeNull(monster, list, "damage_immunities")}
                ${excludeNull(monster, cond, "condition_immunities")}
                ${excludeNull(monster, obj, "senses")}
                <div class="lang"><b>Languages:</b> ${monster.languages}</div>
                
                <div class="challenge"><b>Challenge Rating:</b> ${monster.challenge_rating}</div>
                
                <div class="xp"><b>XP:</b> ${monster.xp}</div>
            </div>
            <hr>
            <div class="special-abilities">
            Special abilities: 
                ${desc(monster.special_abilities)}
            </div>
            <hr>
            <div class="actions">
            Actions:
                ${desc(monster.actions)}
            ${legendary(monster)}
            </div>
        </div>
    </div>`.replace('undefined', '') + container.innerHTML
    }

function excludeNull(monster, orderFunction, spec){
    if(Object.keys(monster[spec]).length > 0 && monster[spec] !== null) {
        console.log(monster[spec], spec)
        return `
    <hr>
    <div class="capitalize ${spec}"><b>${spec.replace('_', ' ')}:</b> ${orderFunction(monster[spec])}</div>
    `
    } else {
        return ''
    }
}



// const list = (arr) => {
//     let res = ''
//     arr.map((item) => {
//         res += `<li>${item}</li>`
//     })
//     return `<ul>${res}</ul>`
// }

const list = (arr) => {
    return `<span>${arr.join(', ')}</span>`
}

// const obj = (o) => {
//     let res = ''
//     for(let prop in o){
//         res += `<li>${prop}: ${o[prop]}</li>`
//     }
//     return `<ul>${res}</ul>`
// }

const obj = (o) => {
    let res = []
    for(let prop in o){
        // res += `<li>${prop}: ${o[prop]}</li>`
        res.push(`${prop}: ${o[prop]}`)
    }
    temp = list(res)
    return temp
}

const detObj = (o) => {
    let res = ''
    for(let prop in o){
        if(typeof prop == 'object'){
            detObj(prop)
        } else {
            obj(o)
        }
        res += `<li>${prop}: ${o[prop]}</li>`
    }
    return `<ul>${res}</ul>`
}

const desc = (array) => {
    let res = ''
    for (let index = 0; index < array.length; index++) {
        res += `<dl>${array[index].name}</dl><dd>${array[index].desc}</dd>`
    }
    return `<ul>${res}</ul>`
}

// const prof = (o) => {
//     let res = ''
//     for(let i = 0; i < o.length; i++){
//         res += `<li>${o[i].proficiency.name}</li>`
//     }
//     return `<ul>${res}</ul>`
// }

const prof = (o) => {
    let res = []
    for(let i = 0; i < o.length; i++){
        res.push(`${o[i].proficiency.name}+${o[i].value}`)
    }
    return list(res)
}

// const cond = (o) => {
//     let res = ''
//     for(let i = 0; i < o.length; i++){
//         res += `<li>${o[i].name}</li>`
//     }
//     return `<ul>${res}</ul>`
// }

const cond = (o) => {
    let res = []
    for(let i = 0; i < o.length; i++){
        res.push(o[i].name)
    }
    return list(res)
}


function legendary(monster){
    if(monster.legendary_actions.length > 0){
        return `Legendary Actions: ${desc(monster.legendary_actions)}`
    } else {
        return ' '
    }
}