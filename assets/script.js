/* app.js
   E4-M4 — Asincronía: Callbacks / Promesas / Async-Await
   Funciona en NAVEGADOR con el HTML/CSS que te pasé (botones + salida).
*/

/*
  ================================
  1) Simulación de Funciones de API
  (NO las modifiques)
  ================================
*/

// API para obtener datos de un usuario
const obtenerUsuario = (id, callback) => {
  const demora = Math.random() * 1000 + 500;
  setTimeout(() => {
    if (!id) {
      callback("Error: ID de usuario no proporcionado.", null);
      return;
    }
    console.log(`Buscando usuario con ID: ${id}...`);
    const usuario = { id: id, nombre: "John Doe", email: "john.doe@example.com" };
    callback(null, usuario);
  }, demora);
};

// API para obtener los posts de un usuario
const obtenerPosts = (userId, callback) => {
  const demora = Math.random() * 1000 + 500;
  setTimeout(() => {
    if (!userId) {
      callback("Error: ID de usuario no proporcionado para buscar posts.", null);
      return;
    }
    console.log(`Buscando posts del usuario con ID: ${userId}...`);
    const posts = [
      { id: 101, titulo: "Mi primer post", contenido: "..." },
      { id: 102, titulo: "Mi segundo post", contenido: "..." },
    ];
    callback(null, posts);
  }, demora);
};

// API para obtener los comentarios de un post
const obtenerComentarios = (postId, callback) => {
  const demora = Math.random() * 1000 + 500;
  setTimeout(() => {
    if (!postId) {
      callback("Error: ID de post no proporcionado para buscar comentarios.", null);
      return;
    }
    console.log(`Buscando comentarios del post con ID: ${postId}...`);
    const comentarios = [
      { id: 1, texto: "¡Excelente post!" },
      { id: 2, texto: "Muy informativo, gracias." },
    ];
    callback(null, comentarios);
  }, demora);
};

/*
  ================================
  2) UI helpers (opcional)
  ================================
*/

const outputEl = document.getElementById("output");

function print(msg) {
  // También imprime en consola
  console.log(msg);

  // Si existe el <pre id="output">, imprime ahí
  if (outputEl) {
    const text = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
    outputEl.textContent += (outputEl.textContent.trim() ? "\n" : "") + text;
    outputEl.scrollTop = outputEl.scrollHeight;
  }
}

function clearOutput() {
  if (outputEl) outputEl.textContent = "";
}

function setButtonsDisabled(disabled) {
  const ids = ["btn-callbacks", "btn-promesas", "btn-async"];
  ids.forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = disabled;
  });
}

/*
  ================================
  3) Parte 1 — Callback Hell
  ================================
*/

function ejecutarCallbacks(userId = 1) {
  clearOutput();
  print("== Ejecutando con CALLBACKS ==");

  setButtonsDisabled(true);

  obtenerUsuario(userId, (err, usuario) => {
    if (err) {
      print(err);
      setButtonsDisabled(false);
      return;
    }

    print({ usuario });

    obtenerPosts(usuario.id, (err, posts) => {
      if (err) {
        print(err);
        setButtonsDisabled(false);
        return;
      }

      if (!posts || posts.length === 0) {
        print("Error: El usuario no tiene posts.");
        setButtonsDisabled(false);
        return;
      }

      print({ posts });

      obtenerComentarios(posts[0].id, (err, comentarios) => {
        if (err) {
          print(err);
          setButtonsDisabled(false);
          return;
        }

        print("Comentarios obtenidos (Callbacks):");
        print(comentarios);

        setButtonsDisabled(false);
      });
    });
  });
}

/*
  ================================
  4) Parte 2 — Promesas
  (envolvemos las funciones con callback)
  ================================
*/

const obtenerUsuarioPromesa = (id) =>
  new Promise((resolve, reject) => {
    obtenerUsuario(id, (err, usuario) => (err ? reject(err) : resolve(usuario)));
  });

const obtenerPostsPromesa = (userId) =>
  new Promise((resolve, reject) => {
    obtenerPosts(userId, (err, posts) => (err ? reject(err) : resolve(posts)));
  });

const obtenerComentariosPromesa = (postId) =>
  new Promise((resolve, reject) => {
    obtenerComentarios(postId, (err, comentarios) =>
      err ? reject(err) : resolve(comentarios)
    );
  });

function ejecutarPromesas(userId = 1) {
  clearOutput();
  print("== Ejecutando con PROMESAS (.then/.catch) ==");

  setButtonsDisabled(true);

  obtenerUsuarioPromesa(userId)
    .then((usuario) => {
      print({ usuario });
      return obtenerPostsPromesa(usuario.id);
    })
    .then((posts) => {
      if (!posts || posts.length === 0) {
        throw new Error("Error: El usuario no tiene posts.");
      }
      print({ posts });
      return obtenerComentariosPromesa(posts[0].id);
    })
    .then((comentarios) => {
      print("Comentarios obtenidos (Promesas):");
      print(comentarios);
    })
    .catch((error) => {
      print("Error en cadena de promesas:");
      print(error?.message ?? error);
    })
    .finally(() => {
      setButtonsDisabled(false);
    });
}

/*
  ================================
  5) Parte 3 — Async/Await
  ================================
*/

async function mostrarPerfilDeUsuario(userId = 1) {
  clearOutput();
  print("== Ejecutando con ASYNC/AWAIT ==");

  setButtonsDisabled(true);

  try {
    const usuario = await obtenerUsuarioPromesa(userId);
    print({ usuario });

    const posts = await obtenerPostsPromesa(usuario.id);
    if (!posts || posts.length === 0) {
      throw new Error("Error: El usuario no tiene posts.");
    }
    print({ posts });

    const comentarios = await obtenerComentariosPromesa(posts[0].id);
    print("Comentarios obtenidos (Async/Await):");
    print(comentarios);
  } catch (error) {
    print("Error en async/await:");
    print(error?.message ?? error);
  } finally {
    setButtonsDisabled(false);
  }
}

/*
  ================================
  6) Eventos de botones (HTML)
  ================================
*/

const btnCallbacks = document.getElementById("btn-callbacks");
const btnPromesas = document.getElementById("btn-promesas");
const btnAsync = document.getElementById("btn-async");
const btnLimpiar = document.getElementById("btn-limpiar");

if (btnCallbacks) btnCallbacks.addEventListener("click", () => ejecutarCallbacks(1));
if (btnPromesas) btnPromesas.addEventListener("click", () => ejecutarPromesas(1));
if (btnAsync) btnAsync.addEventListener("click", () => mostrarPerfilDeUsuario(1));
if (btnLimpiar) btnLimpiar.addEventListener("click", clearOutput);

// Si quieres que arranque solo (opcional), descomenta UNA:
// ejecutarCallbacks(1);
// ejecutarPromesas(1);
// mostrarPerfilDeUsuario(1);