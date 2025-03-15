document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script caricato!");

    let isAdmin = localStorage.getItem("isAdmin") === "true";

    // Nasconde le sezioni riservate agli amministratori
    document.querySelectorAll(".admin-only").forEach(section => {
        section.style.display = isAdmin ? "block" : "none";
    });

    // Mostra le macchine all’avvio
    mostraMacchine();

    // Gestione aggiunta macchina
    document.getElementById("macchinaForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        let nomeMacchina = document.getElementById("nomeMacchina").value.trim();
        if (nomeMacchina === "") return;

        let macchine = JSON.parse(localStorage.getItem("macchine")) || [];
        macchine.push(nomeMacchina);
        localStorage.setItem("macchine", JSON.stringify(macchine));

        document.getElementById("nomeMacchina").value = "";
        mostraMacchine();
    });

    // Selezione macchina
    let macchinaSelezionata = localStorage.getItem("macchinaSelezionata");
    let titoloMacchina = document.getElementById("titoloMacchina");
    if (titoloMacchina && macchinaSelezionata) {
        titoloMacchina.textContent = `Guasti di ${macchinaSelezionata}`;
        mostraGuasti(macchinaSelezionata);
    }

    // Aggiunta guasto
    document.getElementById("guastoForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        let tipoGuasto = document.getElementById("tipoGuasto").value.trim();
        let macchinaSelezionata = localStorage.getItem("macchinaSelezionata");

        if (tipoGuasto === "" || !macchinaSelezionata) return;

        let guasti = JSON.parse(localStorage.getItem("guasti")) || {};
        guasti[macchinaSelezionata] = guasti[macchinaSelezionata] || [];
        guasti[macchinaSelezionata].push(tipoGuasto);
        localStorage.setItem("guasti", JSON.stringify(guasti));

        document.getElementById("tipoGuasto").value = "";
        mostraGuasti(macchinaSelezionata);
    });

    // Selezione guasto
    let guastoSelezionato = localStorage.getItem("guastoSelezionato");
    let titoloGuasto = document.getElementById("titoloGuasto");
    if (titoloGuasto && guastoSelezionato) {
        titoloGuasto.textContent = `Componenti per ${guastoSelezionato}`;
        mostraComponenti(guastoSelezionato);
    }

    // Aggiunta componente
    document.getElementById("componenteForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        let nomeComponente = document.getElementById("nomeComponente").value.trim();
        let siglaComponente = document.getElementById("siglaComponente").value.trim();
        let guastoSelezionato = localStorage.getItem("guastoSelezionato");

        if (nomeComponente === "" || siglaComponente === "" || !guastoSelezionato) return;

        let componenti = JSON.parse(localStorage.getItem("componenti")) || {};
        componenti[guastoSelezionato] = componenti[guastoSelezionato] || [];
        componenti[guastoSelezionato].push({ nome: nomeComponente, sigla: siglaComponente });
        localStorage.setItem("componenti", JSON.stringify(componenti));

        document.getElementById("nomeComponente").value = "";
        document.getElementById("siglaComponente").value = "";
        mostraComponenti(guastoSelezionato);
    });
});

// Mostra la lista delle macchine salvate
function mostraMacchine() {
    let lista = document.getElementById("listaMacchine");
    if (!lista) return;

    let macchine = JSON.parse(localStorage.getItem("macchine")) || [];
    lista.innerHTML = macchine.map((macchina, index) => `
        <li>
            ${macchina} 
            <button onclick="selezionaMacchina('${macchina}')">✅</button> 
            <button class="admin-only" onclick="rimuoviElemento('macchine', ${index}, mostraMacchine)">❌</button>
        </li>
    `).join("");
}

// Seleziona una macchina e va alla pagina dei guasti
function selezionaMacchina(nome) {
    localStorage.setItem("macchinaSelezionata", nome);
    window.location.href = "guasti_macchina.html";
}

// Mostra la lista dei guasti di una macchina
function mostraGuasti(macchina) {
    let lista = document.getElementById("listaGuasti");
    if (!lista) return;

    let guasti = JSON.parse(localStorage.getItem("guasti")) || {};
    lista.innerHTML = (guasti[macchina] || []).map((guasto, index) => `
        <li>
            ${guasto} 
            <button onclick="selezionaGuasto('${guasto}')">🔧</button> 
            <button class="admin-only" onclick="rimuoviElemento('guasti', ${index}, mostraGuasti, '${macchina}')">❌</button>
        </li>
    `).join("");
}

// Seleziona un guasto e va alla pagina dei componenti
function selezionaGuasto(guasto) {
    localStorage.setItem("guastoSelezionato", guasto);
    window.location.href = "componenti.html";
}

// Mostra la lista dei componenti di un guasto in una tabella
function mostraComponenti(guasto) {
    let tabella = document.getElementById("tabellaComponenti");
    if (!tabella) return;

    let componenti = JSON.parse(localStorage.getItem("componenti")) || {};
    tabella.innerHTML = `
        <tr><th>Nome</th><th>Sigla</th><th class="admin-only">Azioni</th></tr>
        ${(componenti[guasto] || []).map((comp, index) => `
            <tr>
                <td>${comp.nome}</td>
                <td>${comp.sigla}</td>
                <td class="admin-only">
                    <button onclick="rimuoviElemento('componenti', ${index}, mostraComponenti, '${guasto}')">❌</button>
                </td>
            </tr>
        `).join("")}
    `;
}

// Rimuove un elemento generico (macchina, guasto, componente)
function rimuoviElemento(storageKey, index, callback, parentKey = null) {
    let data = JSON.parse(localStorage.getItem(storageKey)) || {};
    if (parentKey) {
        if (!data[parentKey]) return;
        data[parentKey].splice(index, 1);
        if (data[parentKey].length === 0) delete data[parentKey];
    } else {
        data.splice(index, 1);
    }
    localStorage.setItem(storageKey, JSON.stringify(data));
    callback(parentKey);
}
