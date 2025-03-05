document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script caricato!");
    mostraMacchine();
    
    let macchinaForm = document.getElementById("macchinaForm");
    if (macchinaForm) {
        macchinaForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let nomeMacchina = document.getElementById("nomeMacchina").value.trim();
            if (nomeMacchina === "") return;

            let macchine = JSON.parse(localStorage.getItem("macchine")) || [];
            macchine.push(nomeMacchina);
            localStorage.setItem("macchine", JSON.stringify(macchine));

            document.getElementById("nomeMacchina").value = "";
            mostraMacchine();
        });
    }

    let macchinaSelezionata = localStorage.getItem("macchinaSelezionata");
    let titoloMacchina = document.getElementById("titoloMacchina");
    if (titoloMacchina && macchinaSelezionata) {
        titoloMacchina.textContent = `Guasti di ${macchinaSelezionata}`;
        mostraGuasti(macchinaSelezionata);
    }

    let guastoForm = document.getElementById("guastoForm");
    if (guastoForm) {
        guastoForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let tipoGuasto = document.getElementById("tipoGuasto").value.trim();
            let macchinaSelezionata = localStorage.getItem("macchinaSelezionata");

            if (tipoGuasto === "" || !macchinaSelezionata) return;

            let guasti = JSON.parse(localStorage.getItem("guasti")) || {};
            if (!guasti[macchinaSelezionata]) {
                guasti[macchinaSelezionata] = [];
            }

            guasti[macchinaSelezionata].push(tipoGuasto);
            localStorage.setItem("guasti", JSON.stringify(guasti));

            document.getElementById("tipoGuasto").value = "";
            mostraGuasti(macchinaSelezionata);
        });
    }

    let guastoSelezionato = localStorage.getItem("guastoSelezionato");
    let titoloGuasto = document.getElementById("titoloGuasto");
    if (titoloGuasto && guastoSelezionato) {
        titoloGuasto.textContent = `Componenti per ${guastoSelezionato}`;
        mostraComponenti(guastoSelezionato);
    }

    let componenteForm = document.getElementById("componenteForm");
    if (componenteForm) {
        componenteForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let nomeComponente = document.getElementById("nomeComponente").value.trim();
            let guastoSelezionato = localStorage.getItem("guastoSelezionato");

            if (nomeComponente === "" || !guastoSelezionato) return;

            let componenti = JSON.parse(localStorage.getItem("componenti")) || {};
            if (!componenti[guastoSelezionato]) {
                componenti[guastoSelezionato] = [];
            }

            componenti[guastoSelezionato].push(nomeComponente);
            localStorage.setItem("componenti", JSON.stringify(componenti));

            document.getElementById("nomeComponente").value = "";
            mostraComponenti(guastoSelezionato);
        });
    }
});

// Mostra la lista delle macchine salvate
function mostraMacchine() {
    let lista = document.getElementById("listaMacchine");
    if (!lista) return;

    let macchine = JSON.parse(localStorage.getItem("macchine")) || [];
    lista.innerHTML = "";

    macchine.forEach((macchina, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${macchina} 
            <button onclick="selezionaMacchina('${macchina}')">✅</button> 
            <button onclick="rimuoviMacchina(${index})">❌</button>`;
        lista.appendChild(li);
    });
}

// Rimuove una macchina
function rimuoviMacchina(index) {
    let macchine = JSON.parse(localStorage.getItem("macchine")) || [];
    macchine.splice(index, 1);
    localStorage.setItem("macchine", JSON.stringify(macchine));
    mostraMacchine();
}

// Seleziona una macchina e va alla pagina dei guasti
function selezionaMacchina(nome) {
    localStorage.setItem("macchinaSelezionata", nome);
    window.location.href = "guasti_macchina.html";
}

// Mostra la lista dei guasti di una macchina
function mostraGuasti(macchina) {
    let guasti = JSON.parse(localStorage.getItem("guasti")) || {};
    let lista = document.getElementById("listaGuasti");
    lista.innerHTML = "";

    if (guasti[macchina] && guasti[macchina].length > 0) {
        guasti[macchina].forEach((guasto, index) => {
            let li = document.createElement("li");
            li.innerHTML = `${guasto} 
                <button onclick="selezionaGuasto('${guasto}')">🔧</button> 
                <button onclick="rimuoviGuasto('${macchina}', ${index})">❌</button>`;
            lista.appendChild(li);
        });
    } else {
        lista.innerHTML = "<li>Nessun guasto registrato.</li>";
    }
}

// Rimuove un guasto
function rimuoviGuasto(macchina, index) {
    let guasti = JSON.parse(localStorage.getItem("guasti")) || {};
    if (guasti[macchina]) {
        guasti[macchina].splice(index, 1);
        localStorage.setItem("guasti", JSON.stringify(guasti));
        mostraGuasti(macchina);
    }
}

// Seleziona un guasto e va alla pagina dei componenti
function selezionaGuasto(guasto) {
    localStorage.setItem("guastoSelezionato", guasto);
    window.location.href = "componenti.html";
}

// Mostra la lista dei componenti di un guasto
function mostraComponenti(guasto) {
    let componenti = JSON.parse(localStorage.getItem("componenti")) || {};
    let lista = document.getElementById("listaComponenti");
    lista.innerHTML = "";

    if (componenti[guasto]) {
        componenti[guasto].forEach((componente, index) => {
            let li = document.createElement("li");
            li.innerHTML = `${componente} 
                <button onclick="rimuoviComponente('${guasto}', ${index})">❌</button>`;
            lista.appendChild(li);
        });
    } else {
        lista.innerHTML = "<li>Nessun componente registrato.</li>";
    }
}

// Rimuove un componente
function rimuoviComponente(guasto, index) {
    let componenti = JSON.parse(localStorage.getItem("componenti")) || {};
    if (componenti[guasto]) {
        componenti[guasto].splice(index, 1);
        localStorage.setItem("componenti", JSON.stringify(componenti));
        mostraComponenti(guasto);
    }
}
