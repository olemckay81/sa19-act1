/*
    Pokemon Team builder
*/

//Declarations
let searchBar = document.getElementById("search-bar");
let submitBtn = document.getElementById("submit");
let clearBtn = document.getElementById("clear-all")

let errorMsg = document.getElementById("error-msg");

let partyList = document.getElementById("party-list");

function findEmptyCard(){
    let partyMembers = partyList.children;
    for(let i = 0; i < partyMembers.length; i++){
        if (partyMembers[i].getAttribute("empty") == "true"){
            partyMembers[i].setAttribute("empty", "false");
            return partyMembers[i];
        }
    }
    return null;
}

function resetCard(card){
    card.innerHTML = `<button class="remove-btn" hidden>&#128473;</button>
                    <h3 class="member-name"></h3>
                    <img class="member-sprite" src="imgs/pokeball.png">
                    <div class="member-typing"></div>`;
    card.setAttribute("empty", "true");
}

function sortCards(){
    let cards = Array.from(partyList.children);

    cards.sort((a, b) => {
        let aEmpty = a.getAttribute("empty") === "true";
        let bEmpty = b.getAttribute("empty") === "true";

        if (aEmpty === bEmpty){
            return 0;
        }

        return aEmpty > bEmpty ? 1 : -1;
    });

    cards.forEach(card => partyList.appendChild(card));
}

function searchPokemon (pokemon) {
    if (!pokemon) return;

    errorMsg.hidden = true;

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    .then(response => response.json())
    .then(data => {
        if (data.constructor !== Object) {
            errorMsg.textContent = "Could not find Pokemon with name";
            errorMsg.hidden = false;
            return
        }
        let card = findEmptyCard();
        if (card === null){
            errorMsg.textContent = "Team cannot exceed 6. Remove members to add more.";
            errorMsg.hidden = false;
            return
        }

        let name = card.getElementsByClassName("member-name")[0];
        let sprite = card.getElementsByClassName("member-sprite")[0];
        let typing = card.getElementsByClassName("member-typing")[0];
        let removeBtn = card.getElementsByClassName("remove-btn")[0];

        name.textContent = data.name;
        sprite.setAttribute("src", data.sprites.front_default);

        removeBtn.hidden = false;
        removeBtn.addEventListener("click", () => {
            resetCard(card);
            sortCards();
        })

        for (let i=0; i < 2; i++ ){
            if (data.types[i] === undefined) break;

            let typeSlot = data.types[i].type.name;
            let typeEle = document.createElement("div");
            typeEle.setAttribute("class", "member-type");
            typeEle.setAttribute("typing", typeSlot);
            typeEle.textContent = typeSlot;
            typing.appendChild(typeEle);
        }

        console.log(data);
    })
    .catch((error) => {
        errorMsg.textContent = "Encountered error while fetching results...";
        errorMsg.hidden = false;
        console.log(error);
    })
}

submitBtn.addEventListener("click", () => {
    let query = searchBar.value;
    searchPokemon(query);
})

clearBtn.addEventListener("click", () => {
    let partyMembers = partyList.children;
    for(let i = 0; i < partyMembers.length; i++){
        resetCard(partyMembers[i]);
    }
});