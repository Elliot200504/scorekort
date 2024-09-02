import { qs, ce, qsa, ael} from "./helper.js";

const inputContainer = qs("#vy2");
const saveButton = qs("#skicka");
const togglemenu = qs("#toggleMenu");
const addButton = qs("#add");
const removeButton = qs("#remove");
//const scoreboardContainer = qs(".scoreboard .display");


let localPlayers = JSON.parse(localStorage.getItem("players"));
let players = localPlayers ? localPlayers : {};


ael(togglemenu, "click", toggleMenu);
ael(addButton, "click", add);
ael(removeButton, "click", remove);
ael(saveButton, "click", skickaSpelare);


document.getElementById("start").click();



let count = 0;

function add() {
    count++;
    if (count <= 10) {
        const newInput = ce("input");
        newInput.className = "input";
        newInput.type = "text";
        newInput.placeholder = "Namn";
        inputContainer.appendChild(newInput);
    }
}

function remove() {
    count--;
    const inputs = qsa("#vy2 .input");
    if (inputs.length > 1) {
        inputContainer.removeChild(inputs[inputs.length - 1]);
    }
}

function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle('show'); 
}

function skickaSpelare() {
    const names = qsa(".input");

    names.forEach(n => {
        if (n.value) {
            players[n.value] = {};
        }
    });

    createGame();
}

async function getCourt(){
    try{
    let res = await fetch("info.json");
    let data = await res.json();
    return data.court;
    } catch (error){
        return[];
    }
    
    }


    async function createGame() {
        let court = await getCourt();
        console.log(court);
    
       
        court.forEach(hole => {
            const holeId = hole.id;
            for (const player in players) {
                players[player][holeId] = { score: 0 };
            }
        });
    
        court.map(hole => generateHole(hole));
    }


    function generateHole(hole) {
        let div = ce("div");
        div.classList.add("hole");
        div.id = "hole" + hole.id; 
        div.innerText = "Hål " + hole.id + " - Par: " + hole.par;
    
     


        let p = ce("p");
        p.classList.add("holename");
        p.innerText = hole.info;
    
        let holeId = hole.id;
    
        let container = updateScoreboard(holeId);
    
        div.appendChild(p);
        
     
        const a = ce('a');
        a.id = "button" + hole.id;
        a.style.border = "1px solid white";
        a.style.scrollMarginTop ="100px";
        if (hole.id != 18){
        hole.id = hole.id + 1;
        a.textContent = "Gå till hål " + hole.id; 
        a.setAttribute('href', `#hole${hole.id}`);
         
        }
        else
        {
            a.textContent = "Gå tillbaks till hål 1"; 
            a.setAttribute('href', `#hole1`); 
        }
        
    
      
        a.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = a.getAttribute('href').substring(1); 
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' }); 
            }
        });
    
        let holebox = ce("div");
        holebox.classList.add("box");
    
        holebox.appendChild(div);
        holebox.appendChild(container);
        holebox.appendChild(a);
        holebox.style.display = "block";
        holebox.style.height = "100vh";
        qs(".display").appendChild(holebox);
    
        return holebox;
    }


    function updateScoreboard(holeId) {
      
        let scoreboardContainer = ce("section");
        scoreboardContainer.classList.add("scoreboard"); 
    
     
        const displayElements = {};
    
        console.log(players);
    
        for (const player in players) {
            const playerDiv = ce("div");
            playerDiv.style.display = "flex"; 
            playerDiv.style.alignItems = "center";
    
            const addScoreButton = ce("button");
            addScoreButton.textContent = "+";
    
   
            ael(addScoreButton, "click", () => {
                players[player][holeId].score++;
                displayElements[player].textContent = `${player}: ${players[player][holeId].score}`;
                localStorage.setItem("players",JSON.stringify(players));
            });
    
            const display = ce("span");
            display.textContent = `${player}: ${players[player][holeId].score}`;
            display.style.flexGrow = "1"; 
            display.style.textAlign = "center"; 
            
  
            displayElements[player] = display;
    
            const removeScoreButton = ce("button");
            removeScoreButton.textContent = "-";
            ael(removeScoreButton, "click", () => {
                if (players[player][holeId].score > 0) {
                    players[player][holeId].score--;
                    displayElements[player].textContent = `${player}: ${players[player][holeId].score}`;
                    localStorage.setItem("players",JSON.stringify(players));
                }
            });
    
            playerDiv.appendChild(addScoreButton);
            playerDiv.appendChild(display);
            playerDiv.appendChild(removeScoreButton);
            scoreboardContainer.appendChild(playerDiv);
        
        }
        
        return scoreboardContainer;
    }