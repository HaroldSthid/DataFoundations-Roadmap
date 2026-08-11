const SEED_SQL = `
CREATE TABLE clientes (id INTEGER PRIMARY KEY, nombre TEXT, ciudad TEXT);
CREATE TABLE productos (id INTEGER PRIMARY KEY, nombre TEXT, precio REAL);
CREATE TABLE ventas (id INTEGER PRIMARY KEY, cliente_id INTEGER, producto_id INTEGER, cantidad INTEGER);

INSERT INTO clientes VALUES
  (1, 'Ana Torres', 'Bogotá'),
  (2, 'Luis Gómez', 'Medellín'),
  (3, 'Marta Ruiz', 'Cali');

INSERT INTO productos VALUES
  (1, 'Teclado mecánico', 180000),
  (2, 'Mouse inalámbrico', 65000),
  (3, 'Monitor 24"', 720000);

INSERT INTO ventas VALUES
  (1, 1, 1, 2),
  (2, 1, 2, 1),
  (3, 2, 3, 1),
  (4, 3, 2, 3),
  (5, 3, 1, 1);
`;

const statusEl = document.getElementById("sql-status");
const resultEl = document.getElementById("sql-result");
const inputEl = document.getElementById("sql-input");
const runBtn = document.getElementById("run-sql");

const editor = CodeMirror.fromTextArea(inputEl, {
  mode: "text/x-sql",
  theme: "default",
  lineNumbers: true,
  matchBrackets: true,
  indentUnit: 2,
});

let db = null;

function setStatus(text, isError) {
  statusEl.textContent = text;
  statusEl.classList.toggle("is-error", Boolean(isError));
}

function renderResults(results) {
  resultEl.innerHTML = "";

  if (!results || results.length === 0) {
    resultEl.textContent = "Consulta ejecutada. Sin filas para mostrar.";
    return;
  }

  results.forEach((res) => {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    res.columns.forEach((col) => {
      const th = document.createElement("th");
      th.textContent = col;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    res.values.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cell) => {
        const td = document.createElement("td");
        td.textContent = cell === null ? "NULL" : cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    resultEl.appendChild(table);
  });
}

function runQuery() {
  if (!db) {
    setStatus("El motor todavía se está cargando, esperá un segundo…", false);
    return;
  }
  try {
    const results = db.exec(editor.getValue());
    renderResults(results);
    setStatus(`OK · ${results.length} resultado(s)`, false);
  } catch (err) {
    resultEl.innerHTML = "";
    setStatus(`Error: ${err.message}`, true);
  }
}

initSqlJs({
  locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`,
})
  .then((SQL) => {
    db = new SQL.Database();
    db.run(SEED_SQL);
    setStatus("Listo. Esquema clientes/productos/ventas cargado.", false);
    runBtn.addEventListener("click", runQuery);
  })
  .catch((err) => {
    setStatus(`No se pudo cargar el motor SQL: ${err.message}`, true);
  });
