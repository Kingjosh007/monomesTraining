let mainArr = monomes.filter(o => belongsToInterval(o["mot"].length, [8, 8]));

let words = shuffleArray(mainArr)
    .slice(0, 20);


// SELECTORS
const exerciceContainer = document.getElementById("exerciceContainer");

// FUNCTIONS

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function pickRandomInArr(arr, shouldPrintRandomN = false) {
    let randomN = Math.floor(Math.random() * arr.length);
    if (shouldPrintRandomN)
        console.log(randomN);

    return arr[randomN];
}

function belongsToInterval(val, intArr, openLeft = false, openRight = false) {
    let signLeft = openLeft ? ">" : ">=";
    let signRight = openRight ? "<" : "<=";
    return eval(`${val} ${signLeft} ${intArr[0]}`) && eval(`${val} ${signRight} ${intArr[1]}`);
}

function createExerciceElt(wordsList) {
    exerciceContainer.innerHTML = "";

    let btn = document.createElement("button");
    btn.classList.add("correctBtn");
    btn.innerHTML = "Corriger";

    let copyBtn = btn.cloneNode(true);

    exerciceContainer.appendChild(btn);

    for (let i = 0; i < wordsList.length; i++) {
        let ind = i + 1;
        let mot = wordsList[i]["t"];
        const tmc = document.createElement("div");
        tmc.classList.add("tirageMotContainer");
        tmc.id = "tirageMotContainer" + ind;

        let tirageSolElt = createMotSolElt(mot, ind);

        tmc.appendChild(tirageSolElt);

        let soc = document.createElement("div");
        soc.classList.add("solutionOnlyContainer");
        soc.classList.add("notCorrected");
        soc.id = "solutionOnlyContainer" + ind;

        tmc.appendChild(soc);
        exerciceContainer.appendChild(tmc);
    }

    exerciceContainer.appendChild(copyBtn);

    // Gestion de la correction

    let correctBtns = [btn, copyBtn];

    correctBtns.forEach(cb => {
        cb.addEventListener("click", correctExercice)
    });

    function correctExercice() {
        for (let i = 0; i < words.length; i++) {
            let ind = i + 1;
            let sol = words[i]["mot"];
            let found = 0;
            let el = document.getElementById("solutionOnlyContainer" + ind);
            let prop = el.textContent;
            if (sol === prop) {
                el.classList.remove("notCorrected");
                el.classList.add("good");
                found++;
            } else {
                el.classList.remove("notCorrected");
                el.classList.add("wrong");
            }
        }

        console.log(found);
    }

}

function createMotSolElt(mot, rank) {
    const toc = document.createElement("div");
    toc.classList.add("tirageOnlyContainer");
    toc.id = "tirageOnlyContainer" + rank;

    let tileSize = mot.length <= 6 ? 6 : mot.length;

    for (let i = 0; i < mot.length; i++) {
        let letter = mot[i];
        let ti = document.createElement("div");
        ti.classList.add("tile");
        ti.classList.add("tile" + tileSize);
        ti.textContent = letter;

        let nbForId = 0;
        for (let j = 0; j < i; j++) {
            if (mot[j] == mot[i])
                nbForId++;
        }
        nbForId++;
        ti.id = "tile" + rank + "-" + letter + nbForId;
        toc.appendChild(ti);
    }


    return toc;

}

createExerciceElt(words);

// SELECTORS AND LISTENER ON TILES

const tiles = document.querySelectorAll(".tile");

tiles.forEach(tile => {
    tile.addEventListener("click", () => {
        let tileParent = tile.parentElement;
        let elId = tile.id;
        if (tileParent.classList.contains("tirageOnlyContainer") && !tile.classList.contains("clicked")) {
            let tirId = tileParent.id;
            let solId = "solution" + tirId.split("tirage")[1];
            let solElt = document.getElementById(solId);
            let tileCopy = tile.cloneNode(true);
            tileCopy.id = tileCopy.id + "-sol";

            tileCopy.addEventListener("click", (ev) => {
                let thisid = ev.target.id;
                let selt = ev.target.parentElement;
                console.log(selt);
                console.log(thisid);
                thisid = thisid.split("-sol")[0];
                selt.removeChild(ev.target);
                document.getElementById(thisid).classList.remove("clicked");
            })
            solElt.appendChild(tileCopy);
            tile.classList.add("clicked");

        }

    });
});