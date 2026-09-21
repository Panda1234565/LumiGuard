/* =========================
   VARIABLES PRINCIPALES
========================= */

let segundos = 0;

let activo = false;

let contador = null;

let puntos = 0;

let descansos = 0;

let sesiones = 0;

let nivel = 1;

let racha = 0;

/* =========================
   MODO CONFORT
========================= */

let modoConfort = false;

/* =========================
   DESCANSO
========================= */

let descansoActivo = false;

let tiempoDescanso = 10 * 60;

let contadorDescanso = null;

/* =========================
   CÁMARA
========================= */

let streamCamara = null;

let camaraActiva = false;

let analisisCamara = null;

/* =========================
   SENSOR DE LUZ
========================= */

let lecturaAnterior = 0;

let lecturaSuavizada = 0;

let ultimoAmbiente = "";

let ultimaActualizacionLumi = 0;

const INTERVALO_LUMI = 5000;

/* =========================
   RECOMPENSAS
========================= */

let recompensasDesbloqueadas = [];

/* =========================
   ELEMENTOS
========================= */

const video = document.getElementById("camera");

const canvas = document.getElementById("canvasAnalisis");

const contexto = canvas.getContext("2d");

const cameraButton = document.getElementById("cameraButton");

/* =========================
   ACTIVAR PROTECCIÓN
========================= */

function activarProteccion() {
  if (activo) {
    return;
  }

  activo = true;

  sesiones++;

  document.getElementById("sesiones").innerText = sesiones;

  document.getElementById("historialSesiones").innerText = sesiones;

  document.getElementById("mensaje").innerText =
    "LumiGuard está monitoreando tu sesión.";

  document.getElementById("estado").innerText = "ACTIVO";

  document.getElementById("botonProteccion").innerText = "🛡️ PROTECCIÓN ACTIVA";

  document.getElementById("botonProteccion").disabled = true;

  actualizarLumi(
    "¡Vamos! Estoy atento 👀",
    "Voy a controlar tu tiempo y las condiciones de iluminación.",
    true
  );

  contador = setInterval(function () {
    segundos++;

    mostrarTiempo();

    calcularRiesgo();

    actualizarEstadisticas();
  }, 1000);

  iniciarCamara();
}

/* =========================
   TIEMPO
========================= */

function mostrarTiempo() {
  let minutos = Math.floor(segundos / 60);

  let segundosRestantes = segundos % 60;

  document.getElementById("tiempo").innerText =
    String(minutos).padStart(2, "0") +
    ":" +
    String(segundosRestantes).padStart(2, "0");
}

/* =========================
   RIESGO
========================= */

function calcularRiesgo() {
  let tiempoMaximo = parseInt(document.getElementById("tiempoUso").value) * 60;

  let porcentajeTiempo = (segundos / tiempoMaximo) * 100;

  porcentajeTiempo = Math.min(100, porcentajeTiempo);

  let riesgo = Math.round(porcentajeTiempo);

  document.getElementById("barraRiesgo").style.width = riesgo + "%";

  document.getElementById("porcentaje").innerText = riesgo + "%";

  if (riesgo < 60) {
    activarLuz("verde");

    document.getElementById("estado").innerText = "BUEN HÁBITO";

    document.getElementById("mensaje").innerText =
      "Tu tiempo de sesión todavía es moderado.";

    document.getElementById("ojo").innerText = "👁️";
  } else if (riesgo < 85) {
    activarLuz("amarillo");

    document.getElementById("estado").innerText = "ATENCIÓN";

    document.getElementById("mensaje").innerText =
      "Llevas bastante tiempo frente a la pantalla.";

    document.getElementById("ojo").innerText = "👀";
  } else {
    activarLuz("rojo");

    document.getElementById("estado").innerText = "DESCANSO RECOMENDADO";

    document.getElementById("mensaje").innerText =
      "Es un buen momento para realizar un descanso.";

    document.getElementById("ojo").innerText = "😵‍💫";

    actualizarLumi(
      "Ya llevas bastante tiempo 👀",
      "Sería bueno realizar un descanso de la pantalla.",
      false
    );
  }
}

/* =========================
   SEMÁFORO
========================= */

function activarLuz(color) {
  document.getElementById("verde").classList.remove("active");

  document.getElementById("amarillo").classList.remove("active");

  document.getElementById("rojo").classList.remove("active");

  document.getElementById(color).classList.add("active");
}

/* =========================
   MODO CONFORT
========================= */

function toggleComfortMode() {
  modoConfort = !modoConfort;

  document.body.classList.toggle("comfort-mode", modoConfort);

  let estado = document.getElementById("comfortStatus");

  let boton = document.getElementById("comfortButton");

  if (modoConfort) {
    estado.innerText = "Activado";

    boton.innerText = "☀️ DESACTIVAR";

    desbloquearRecompensa(
      "recompensa6",
      "✓ Desbloqueado",
      "🌙 Amigo de la vista"
    );

    actualizarLumi(
      "Modo Confort activado 🌙",
      "Muy bien. Ahora la interfaz tiene una intensidad visual más suave.",
      true
    );
  } else {
    estado.innerText = "Desactivado";

    boton.innerText = "🌙 ACTIVAR";
  }
}

/* =========================
   DESCANSO
========================= */

function iniciarDescanso() {
  if (descansoActivo) {
    return;
  }

  descansoActivo = true;

  tiempoDescanso =
    parseInt(document.getElementById("tiempoDescanso").value) * 60;

  document.getElementById("botonDescanso").disabled = true;

  mostrarTiempoDescanso();

  actualizarLumi(
    "Descanso activado 💤",
    "Ahora puedes alejarte de la pantalla durante unos minutos.",
    true
  );

  contadorDescanso = setInterval(function () {
    tiempoDescanso--;

    mostrarTiempoDescanso();

    if (tiempoDescanso <= 0) {
      terminarDescanso();
    }
  }, 1000);
}

/* =========================
   TEMPORIZADOR
========================= */

function mostrarTiempoDescanso() {
  let minutos = Math.floor(tiempoDescanso / 60);

  let segundos = tiempoDescanso % 60;

  document.getElementById("restTimer").innerText =
    String(minutos).padStart(2, "0") + ":" + String(segundos).padStart(2, "0");
}

/* =========================
   TERMINAR DESCANSO
========================= */

function terminarDescanso() {
  clearInterval(contadorDescanso);

  descansoActivo = false;

  descansos++;

  racha++;

  puntos += 10;

  document.getElementById("descansos").innerText = descansos;

  document.getElementById("puntos").innerText = puntos + " XP";

  nivel = Math.floor(puntos / 30) + 1;

  document.getElementById("nivel").innerText = nivel;

  document.getElementById("nivelGrande").innerText = nivel;

  document.getElementById("botonDescanso").disabled = false;

  document.getElementById("restTimer").innerText = "✓";

  document.getElementById("mensaje").innerText =
    "¡Descanso completado! Ganaste 10 XP.";

  document.getElementById("estado").innerText = "DESCANSO COMPLETADO";

  actualizarRecompensas();

  actualizarEstadisticas();

  actualizarLumi(
    "¡Descanso completado! 🤩",
    "Ganaste 10 XP. ¡Sigue cuidando tu vista!",
    true
  );
}

/* =========================
   ESTADÍSTICAS
========================= */

function actualizarEstadisticas() {
  document.getElementById("historialSesiones").innerText = sesiones;

  document.getElementById("historialDescansos").innerText = descansos;

  document.getElementById("historialXP").innerText = puntos;

  document.getElementById("historialNivel").innerText = nivel;

  document.getElementById("racha").innerText = racha;

  let minutos = Math.floor(segundos / 60);

  let segundosRestantes = segundos % 60;

  document.getElementById("tiempoTotal").innerText =
    String(minutos).padStart(2, "0") +
    ":" +
    String(segundosRestantes).padStart(2, "0");
}

/* =========================
   RECOMPENSAS
========================= */

function actualizarRecompensas() {
  let xpActual = puntos % 30;

  if (xpActual === 0 && puntos > 0) {
    xpActual = 30;
  }

  document.getElementById("xpTexto").innerText = xpActual + " / 30 XP";

  let porcentajeXP = (xpActual / 30) * 100;

  document.getElementById("barraXP").style.width = porcentajeXP + "%";

  if (descansos >= 1) {
    desbloquearRecompensa(
      "recompensa1",
      "✓ Desbloqueado",
      "🟢 Primer descanso"
    );
  }

  if (nivel >= 2) {
    desbloquearRecompensa(
      "recompensa2",
      "✓ Desbloqueado",
      "⭐ Cuidador constante"
    );
  }

  if (nivel >= 3) {
    desbloquearRecompensa(
      "recompensa3",
      "✓ Desbloqueado",
      "🛡️ Protector visual"
    );
  }

  if (nivel >= 5) {
    desbloquearRecompensa(
      "recompensa4",
      "✓ Desbloqueado",
      "👑 Maestro del descanso"
    );
  }
}

/* =========================
   DESBLOQUEAR RECOMPENSA
========================= */

function desbloquearRecompensa(id, texto, nombre = "") {
  let recompensa = document.getElementById(id);

  if (recompensa.classList.contains("unlocked")) {
    return;
  }

  recompensa.classList.remove("locked");

  recompensa.classList.add("unlocked");

  let strong = recompensa.querySelector("strong");

  strong.innerText = texto;

  recompensa.classList.add("just-unlocked");

  setTimeout(function () {
    recompensa.classList.remove("just-unlocked");
  }, 900);

  mostrarPopupRecompensa(nombre);

  actualizarLumi(
    "¡Nueva recompensa! 🏆",
    "Acabas de desbloquear: " + nombre,
    true
  );
}

/* =========================
   POPUP
========================= */

function mostrarPopupRecompensa(nombre) {
  let popup = document.getElementById("rewardPopup");

  document.getElementById("rewardPopupText").innerText = nombre;

  popup.classList.add("show");

  setTimeout(function () {
    popup.classList.remove("show");
  }, 4000);
}

/* =========================
   CÁMARA
========================= */

async function iniciarCamara() {
  if (camaraActiva) {
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    mostrarErrorCamara(
      "Tu navegador no permite acceder a la cámara desde esta página."
    );

    return;
  }

  try {
    streamCamara = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",

        width: {
          ideal: 640
        },

        height: {
          ideal: 480
        }
      },

      audio: false
    });

    video.srcObject = streamCamara;

    camaraActiva = true;

    document.querySelector(".camera-box").classList.add("active");

    document.getElementById("cameraStatus").innerText = "🟢 CÁMARA ACTIVA";

    cameraButton.innerText = "⏹️ DETENER CÁMARA";

    lecturaAnterior = 0;

    lecturaSuavizada = 0;

    ultimoAmbiente = "";

    analisisCamara = setInterval(analizarIluminacion, 500);

    desbloquearRecompensa(
      "recompensa5",
      "✓ Desbloqueado",
      "💡 Detector de luz"
    );

    actualizarLumi(
      "Sensor activado 📷",
      "Estoy analizando la iluminación de tu entorno.",
      true
    );
  } catch (error) {
    console.error(error);

    mostrarErrorCamara(
      "No se pudo acceder a la cámara. Revisa el permiso del navegador."
    );
  }
}

/* =========================
   DETENER CÁMARA
========================= */

function detenerCamara() {
  if (analisisCamara) {
    clearInterval(analisisCamara);

    analisisCamara = null;
  }

  if (streamCamara) {
    streamCamara.getTracks().forEach((track) => track.stop());

    streamCamara = null;
  }

  video.srcObject = null;

  camaraActiva = false;

  document.querySelector(".camera-box").classList.remove("active");

  document.getElementById("cameraStatus").innerText = "⚪ CÁMARA INACTIVA";

  cameraButton.innerText = "📷 ACTIVAR CÁMARA";

  document.getElementById("ambiente").innerText = "Sin analizar";

  document.getElementById("lux").innerText = "0 lx";

  document.getElementById("nivelLuz").innerText = "0%";

  document.getElementById("barraLuz").style.width = "0%";

  document.getElementById("brilloRecomendado").innerText = "--%";

  document.getElementById("barraBrillo").style.width = "0%";

  document.getElementById("ajusteBrillo").innerText =
    "Esperando análisis de iluminación...";

  document.getElementById("recomendacionBrillo").innerText =
    "Activa la cámara para analizar la iluminación.";

  lecturaAnterior = 0;

  lecturaSuavizada = 0;
}

/* =========================
   BOTÓN CÁMARA
========================= */

function alternarCamara() {
  if (camaraActiva) {
    detenerCamara();
  } else {
    iniciarCamara();
  }
}

/* =========================
   ANALIZAR ILUMINACIÓN
========================= */

function analizarIluminacion() {
  if (!camaraActiva) {
    return;
  }

  if (video.readyState < 2) {
    return;
  }

  canvas.width = 120;

  canvas.height = 90;

  contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

  let datos = contexto.getImageData(0, 0, canvas.width, canvas.height).data;

  let sumaTotal = 0;

  let sumaCentro = 0;

  let maximo = 0;

  let pixelesMuyBrillantes = 0;

  let cantidad = datos.length / 4;

  let centroXInicio = 30;

  let centroXFin = 90;

  let centroYInicio = 20;

  let centroYFin = 70;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let posicion = (y * canvas.width + x) * 4;

      let rojo = datos[posicion];

      let verde = datos[posicion + 1];

      let azul = datos[posicion + 2];

      let luminosidad = 0.299 * rojo + 0.587 * verde + 0.114 * azul;

      sumaTotal += luminosidad;

      if (luminosidad > maximo) {
        maximo = luminosidad;
      }

      if (luminosidad > 220) {
        pixelesMuyBrillantes++;
      }

      if (
        x >= centroXInicio &&
        x <= centroXFin &&
        y >= centroYInicio &&
        y <= centroYFin
      ) {
        sumaCentro += luminosidad;
      }
    }
  }

  let promedio = sumaTotal / cantidad;

  let cantidadCentro =
    (centroXFin - centroXInicio + 1) * (centroYFin - centroYInicio + 1);

  let promedioCentro = sumaCentro / cantidadCentro;

  let porcentajePromedio = (promedio / 255) * 100;

  let porcentajeCentro = (promedioCentro / 255) * 100;

  let porcentajePico = (maximo / 255) * 100;

  let porcentajeBlancos = (pixelesMuyBrillantes / cantidad) * 100;

  let nivelBase =
    porcentajePromedio * 0.45 +
    porcentajeCentro * 0.3 +
    porcentajePico * 0.1 +
    Math.min(porcentajeBlancos * 3, 15);

  let diferencia = porcentajeCentro - lecturaAnterior;

  if (diferencia > 8) {
    nivelBase += Math.min(diferencia * 0.8, 20);
  }

  nivelBase = Math.max(0, Math.min(100, nivelBase));

  if (lecturaSuavizada === 0) {
    lecturaSuavizada = nivelBase;
  } else {
    lecturaSuavizada = lecturaSuavizada * 0.65 + nivelBase * 0.35;
  }

  let nivelFinal = Math.round(lecturaSuavizada);

  lecturaAnterior = porcentajeCentro;

  if (porcentajeCentro > 75 && diferencia > 10) {
    nivelFinal = Math.min(100, nivelFinal + 12);
  }

  let luxEstimados = calcularLuxEstimados(nivelFinal);

  document.getElementById("nivelLuz").innerText = nivelFinal + "%";

  document.getElementById("barraLuz").style.width = nivelFinal + "%";

  document.getElementById("lux").innerText = luxEstimados + " lx";

  actualizarAmbiente(nivelFinal, luxEstimados);
}

/* =========================
   LUX ESTIMADOS
========================= */

function calcularLuxEstimados(nivel) {
  let lux = Math.round(Math.pow(nivel / 100, 1.55) * 1200);

  if (nivel < 5) {
    lux = 5;
  }

  return lux;
}

/* =========================
   AMBIENTE
========================= */

function actualizarAmbiente(nivel, lux) {
  let ambiente = document.getElementById("ambiente");

  let recomendacion = document.getElementById("recomendacionBrillo");

  let textoBrillo = document.getElementById("textoBrillo");

  let nuevoAmbiente;

  if (nivel < 25) {
    nuevoAmbiente = "🌑 OSCURO";

    recomendacion.innerText =
      "Hay poca iluminación. Mejora primero la luz ambiental y reduce ligeramente el brillo de la pantalla.";

    textoBrillo.innerText =
      "El ambiente parece oscuro. Se recomienda reducir aproximadamente entre 20% y 30% el brillo de la pantalla y usar una luz ambiental suave.";

    actualizarBrillo(45, "Reduce aproximadamente 20–30% el brillo.");
  } else if (nivel < 70) {
    nuevoAmbiente = "🟢 ILUMINACIÓN NORMAL";

    recomendacion.innerText =
      "La iluminación parece adecuada. Mantén un brillo cómodo.";

    textoBrillo.innerText =
      "La iluminación parece adecuada. Puedes mantener el brillo aproximadamente entre 50% y 70%, según tu comodidad.";

    actualizarBrillo(60, "Mantén el brillo aproximadamente entre 50% y 70%.");
  } else if (nivel < 90) {
    nuevoAmbiente = "☀️ MUY ILUMINADO";

    recomendacion.innerText =
      "Hay bastante luz. Si la pantalla se ve oscura, aumenta ligeramente el brillo.";

    textoBrillo.innerText =
      "El ambiente tiene bastante iluminación. Considera aumentar aproximadamente entre 15% y 25% el brillo de la pantalla.";

    actualizarBrillo(80, "Aumenta aproximadamente 15–25% el brillo.");
  } else {
    nuevoAmbiente = "🔦 LUZ MUY INTENSA";

    recomendacion.innerText =
      "La iluminación es muy alta. Si la pantalla se ve oscura, aumenta ligeramente el brillo.";

    textoBrillo.innerText =
      "La cámara detecta una iluminación muy intensa. Revisa el brillo de la pantalla y evita una fuente de luz directa hacia los ojos.";

    actualizarBrillo(
      95,
      "Revisa el brillo y evita una luz directa hacia los ojos."
    );
  }

  ambiente.innerText = nuevoAmbiente;

  let ahora = Date.now();

  if (
    nuevoAmbiente !== ultimoAmbiente &&
    ahora - ultimaActualizacionLumi >= INTERVALO_LUMI
  ) {
    ultimoAmbiente = nuevoAmbiente;

    ultimaActualizacionLumi = ahora;

    if (nivel < 25) {
      actualizarLumi(
        "Está un poco oscuro 🌑",
        "Detecté poca iluminación. Procura tener una luz ambiental suave.",
        false
      );
    } else if (nivel < 70) {
      actualizarLumi(
        "La iluminación está bien 👍",
        "El ambiente parece adecuado. Mantén un brillo cómodo.",
        false
      );
    } else if (nivel < 90) {
      actualizarLumi(
        "¡Hay bastante luz! ☀️",
        "La iluminación es alta. Revisa que la pantalla se vea cómoda.",
        false
      );
    } else {
      actualizarLumi(
        "¡Hay mucha luz! 🔦",
        "Detecté una iluminación muy intensa en el entorno.",
        false
      );
    }
  }
}

/* =========================
   BRILLO
========================= */

function actualizarBrillo(porcentaje, mensaje) {
  document.getElementById("brilloRecomendado").innerText = porcentaje + "%";

  document.getElementById("barraBrillo").style.width = porcentaje + "%";

  document.getElementById("ajusteBrillo").innerText = mensaje;
}

/* =========================
   ERROR CÁMARA
========================= */

function mostrarErrorCamara(mensaje) {
  document.getElementById("cameraStatus").innerText = "🔴 ERROR DE CÁMARA";

  document.getElementById("recomendacionBrillo").innerText = mensaje;

  actualizarLumi("No pude activar la cámara 📷", mensaje, true);
}

/* =========================
   LUMI
========================= */

function actualizarLumi(titulo, mensaje, forzado = false) {
  if (!forzado) {
    let ahora = Date.now();

    if (ahora - ultimaActualizacionLumi < INTERVALO_LUMI) {
      return;
    }

    ultimaActualizacionLumi = ahora;
  }

  document.getElementById("lumiTitle").innerText = titulo;

  document.getElementById("lumiMessage").innerText = mensaje;

  let personaje = document.getElementById("lumiCharacter");

  personaje.classList.remove("active");

  void personaje.offsetWidth;

  personaje.classList.add("active");

  /*
       Cambiamos la expresión
       según el mensaje.
    */

  let boca = document.getElementById("lumiMouth");

  if (
    titulo.includes("completado") ||
    titulo.includes("recompensa") ||
    titulo.includes("Vamos")
  ) {
    boca.style.height = "15px";

    boca.style.borderBottom = "4px solid #07131f";
  } else if (
    titulo.includes("oscuro") ||
    titulo.includes("mucho") ||
    titulo.includes("tiempo")
  ) {
    boca.style.height = "4px";
  } else {
    boca.style.height = "10px";
  }
}

/* =========================
   TIEMPO DE USO
========================= */

document.getElementById("tiempoUso").addEventListener("change", function () {
  if (activo) {
    calcularRiesgo();
  }
});

/* =========================
   TIEMPO DE DESCANSO
========================= */

document
  .getElementById("tiempoDescanso")
  .addEventListener("change", function () {
    if (!descansoActivo) {
      tiempoDescanso = parseInt(this.value) * 60;

      mostrarTiempoDescanso();
    }
  });
