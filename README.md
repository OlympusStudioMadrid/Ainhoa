# 🌸 Galería del bautizo de Ainhoa

Web de galería fotográfica que muestra automáticamente las fotos guardadas
en una carpeta de Google Drive. Pensada para publicarse gratis en **GitHub
Pages**, sin necesidad de servidor propio.

Esta guía está escrita para que puedas seguirla **sin ser programador/a**.
Tómate tu tiempo, es un proceso de una sola vez.

---

## Índice

1. [Cómo funciona (en una frase)](#1-cómo-funciona)
2. [Crear el proyecto en Google Cloud](#2-crear-el-proyecto-en-google-cloud)
3. [Activar la API de Google Drive](#3-activar-la-api-de-google-drive)
4. [Generar y restringir la API key](#4-generar-y-restringir-la-api-key)
5. [Preparar la carpeta de Google Drive](#5-preparar-la-carpeta-de-google-drive)
6. [Obtener el ID de la carpeta](#6-obtener-el-id-de-la-carpeta)
7. [Rellenar `js/config.js`](#7-rellenar-jsconfigjs)
8. [Probar la web en tu ordenador](#8-probar-la-web-en-tu-ordenador)
9. [Subir el proyecto a GitHub](#9-subir-el-proyecto-a-github)
10. [Activar GitHub Pages](#10-activar-github-pages)
11. [Cómo actualizar las fotos](#11-cómo-actualizar-las-fotos)
12. [Configurar "Descargar todas"](#12-configurar-descargar-todas)
13. [Solución de problemas](#13-solución-de-problemas)
14. [Privacidad — leer antes de compartir el enlace](#14-privacidad--leer-antes-de-compartir-el-enlace)
15. [Arquitectura del proyecto](#15-arquitectura-del-proyecto)

---

## 1. Cómo funciona

La web pide, en el momento en que alguien la visita, la lista de fotos de
una carpeta de Google Drive **usando el navegador del propio visitante**
(no hay servidor intermedio). Por eso necesitas una **API key** de Google
(para poder hacer esa petición) y el **ID de la carpeta** (para saber
dónde buscar).

---

## 2. Crear el proyecto en Google Cloud

1. Entra en <https://console.cloud.google.com/>.
2. Inicia sesión con la cuenta de Google donde tengas (o vayas a tener)
   las fotos en Drive.
3. Arriba a la izquierda, pulsa el selector de proyecto → **Proyecto
   nuevo**.
4. Ponle un nombre, por ejemplo `bautizo-ainhoa`, y créalo.

## 3. Activar la API de Google Drive

1. Con el proyecto seleccionado, ve a **APIs y servicios → Biblioteca**.
2. Busca **"Google Drive API"**.
3. Pulsa **Habilitar**.

## 4. Generar y restringir la API key

1. Ve a **APIs y servicios → Credenciales**.
2. **Crear credenciales → Clave de API**. Se generará una clave; cópiala.
3. **Muy importante:** pulsa en la clave recién creada para editarla y
   restríngela:
   - **Restricciones de la API:** selecciona "Restringir clave" y marca
     únicamente **Google Drive API**.
   - **Restricciones de la aplicación:** elige **Referentes HTTP (sitios
     web)** y añade la URL de tu futura página de GitHub Pages, por
     ejemplo:
     ```
     https://tu-usuario.github.io/*
     ```
     Añade también `http://localhost:*/*` si quieres poder probarla en
     tu ordenador antes de publicarla.
4. Guarda los cambios.

> ⚠️ **Esta clave viajará dentro del código JavaScript que cualquiera
> puede ver** (con clic derecho → "Ver código fuente" en cualquier
> navegador). Eso es normal en una web estática: **no es un secreto**.
> Lo que de verdad la protege de un uso indebido es la restricción de
> dominio del paso anterior — sin ella, cualquiera podría usar tu clave
> desde otra web. La clave **autoriza llamadas a la API**, pero **no
> decide qué fotos son visibles**: eso lo controla el permiso para
> compartir de la carpeta de Drive (siguiente paso).

## 5. Preparar la carpeta de Google Drive

1. Crea una carpeta en Drive y sube dentro las fotos del bautizo.
2. Clic derecho sobre la carpeta → **Compartir → Compartir**.
3. Cambia el acceso general a **"Cualquier persona con el enlace"** y el
   rol a **Lector**.

Sin este paso, la API devolverá error de permisos aunque la clave y el
ID estén bien configurados: la API key autentica la *petición*, pero
sigue siendo Drive quien decide si esos archivos son visibles para
alguien que no ha iniciado sesión.

## 6. Obtener el ID de la carpeta

Abre la carpeta en Drive y mira la URL:

```
https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
                                        └──────────── esto ────────────┘
```

Ese fragmento final es el `GOOGLE_DRIVE_FOLDER_ID`.

## 7. Rellenar `js/config.js`

Abre `js/config.js` con cualquier editor de texto y sustituye:

```javascript
GOOGLE_API_KEY: "PEGAR_AQUI_API_KEY",
GOOGLE_DRIVE_FOLDER_ID: "PEGAR_AQUI_FOLDER_ID",
```

por tus valores reales. Ese mismo archivo también tiene **todos los
textos** que se ven en la página (frase de encabezado, título,
subtítulo, fecha, hora, lugar, texto del scroll y del pie de página) —
ya están rellenos con los datos de la invitación en modo "recuerdo"
(el bautizo ya se celebró), pero puedes ajustarlos si algo cambia.
`js/config.js` es el único archivo que necesitas tocar para cualquier
cambio de contenido; el resto de archivos son solo estructura y
diseño.

## 8. Probar la web en tu ordenador

No puedes abrir `index.html` haciendo doble clic (el navegador bloquea
las peticiones de la API en modo `file://`). Necesitas un mini-servidor
local:

- Si tienes **Python** instalado: abre una terminal en la carpeta del
  proyecto y ejecuta `python3 -m http.server 8000`, luego visita
  `http://localhost:8000`.
- Si usas **Visual Studio Code**: instala la extensión "Live Server" y
  pulsa "Go Live".

## 9. Subir el proyecto a GitHub

1. Crea una cuenta en <https://github.com> si no tienes una.
2. Crea un repositorio nuevo (puede ser privado o público — ver la
   sección de privacidad más abajo antes de decidir).
3. Sube todos los archivos de esta carpeta al repositorio (arrastrando
   los archivos desde la web de GitHub es suficiente si no usas Git).

## 10. Activar GitHub Pages

1. En el repositorio, ve a **Settings → Pages**.
2. En "Build and deployment", elige **Deploy from a branch**.
3. Selecciona la rama `main` y la carpeta `/ (root)`.
4. Guarda. En un par de minutos tu web estará publicada en:
   ```
   https://tu-usuario.github.io/nombre-del-repositorio/
   ```
5. Vuelve al paso 4 y añade esa URL exacta a las restricciones de la
   API key si no lo hiciste antes.

## 11. Cómo actualizar las fotos

Simplemente sube nuevas fotos a la carpeta de Drive. No hace falta tocar
nada del código ni volver a publicar: la próxima vez que alguien abra la
web, la galería se generará con las fotos que haya en ese momento.

## 12. Configurar "Descargar todas"

Una web estática **no puede empaquetar de forma fiable, en el propio
navegador de cada visitante, decenas de fotos en un ZIP** descargadas
desde Drive: el navegador tendría que descargar cada imagen en memoria
y comprimirla al vuelo, lo cual falla o va muy lento con galerías
grandes y con fotos de resolución alta, y además puede chocar con las
políticas de CORS de Google.

La solución fiable es dejar que **Google Drive haga el ZIP una vez**, y
que el botón sea un enlace directo de descarga (una navegación normal
del navegador, no código JavaScript, así que no depende de CORS):

1. Abre la carpeta de Drive, selecciona todas las fotos (`Ctrl/Cmd+A`).
2. Clic derecho → **Descargar**. Drive generará y descargará un `.zip`.
3. Vuelve a subir ese `.zip` a Drive y compártelo también como
   "Cualquier persona con el enlace — Lector".
4. Copia su enlace de descarga directa (clic derecho sobre el archivo →
   Compartir → copiar enlace, y sustituye `/view` por
   `/uc?export=download` si hace falta, o usa el enlace que te dé la
   opción "Descargar") y pégalo en `DOWNLOAD_ALL_URL` dentro de
   `js/config.js`.

Si prefieres no usar Drive para esto, cualquier otro enlace de descarga
directa de un ZIP (por ejemplo subido a un "Release" de GitHub) funciona
igual de bien: la web solo necesita una URL a la que enlazar.

## 13. Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| "No hemos podido cargar las fotografías" | Falta la API key o el folder ID en `config.js` | Revisa el paso 7 |
| Error 403 en la consola del navegador | La carpeta no es pública, o la API key no está restringida al dominio correcto | Revisa los pasos 4 y 5 |
| Error 400 / "API not enabled" | La Google Drive API no está habilitada en el proyecto | Revisa el paso 3 |
| Las fotos no cargan solo en GitHub Pages (sí en local) | Falta añadir la URL real de GitHub Pages a las restricciones de la API key | Revisa el paso 4 |
| La galería tarda mucho | Carpeta con cientos de fotos de muy alta resolución | Es normal la primera carga; las miniaturas ya están optimizadas, pero puedes reducir el tamaño de las fotos originales antes de subirlas |

## 14. Privacidad — leer antes de compartir el enlace

Estas son fotos de una menor, así que merece la pena dedicar un minuto a
esto:

- **GitHub Pages es público por defecto.** Cualquier persona con el
  enlace (aunque no lo hayas compartido tú directamente, si alguien lo
  reenvía) podrá ver la web. GitHub Pages gratuito no permite poner
  contraseña a la página.
- **La carpeta de Drive, al compartirla como "cualquiera con el
  enlace", es visible para quien tenga ese enlace**, esté o no
  registrado en Drive. No aparece en buscadores de Google salvo que
  alguien la enlace públicamente desde otro sitio.
- **La API key no protege las fotos.** Solo autoriza que la página
  pueda "preguntarle" cosas a la API de Drive. Quien decide qué es
  visible es el permiso para compartir del paso 5.
- El archivo `meta name="robots" content="noindex, nofollow"` ya
  incluido en `index.html` pide a los buscadores que no indexen la
  página, pero esto es una petición, no una barrera de seguridad real.

**Recomendaciones:**

- Comparte el enlace solo por canales privados (WhatsApp, email) y solo
  con quien de verdad debería tener acceso.
- Si quieres una capa extra de control, valora usar un repositorio
  **privado** en GitHub (con GitHub Pages siendo público igualmente
  para el sitio en sí, pero sin exponer el código fuente en el
  repositorio) o limitar el acceso a la carpeta de Drive a una lista de
  correos concretos en lugar de "cualquiera con el enlace" — en ese
  caso, cada visitante necesitaría iniciar sesión con una cuenta de
  Google autorizada, lo que cambia la arquitectura de la API (dejaría
  de funcionar con solo una API key).
- Cuando ya no quieras que la web sea accesible, puedes desactivar
  GitHub Pages en cualquier momento desde **Settings → Pages**, o
  cambiar el permiso de la carpeta de Drive a privado.

---

## 15. Arquitectura del proyecto

```
/
├── index.html              → Estructura de la página (hero, galería, modal, estados)
├── css/
│   └── styles.css          → Toda la identidad visual, layout masonry y responsive
├── js/
│   ├── config.js           → Único archivo que edita el usuario (claves y textos)
│   ├── utils.js             → Helpers genéricos (throttle, bloqueo de scroll, etc.)
│   ├── drive.js             → Toda la comunicación con la API de Google Drive
│   ├── gallery.js           → Construye el masonry y el lazy loading
│   ├── modal.js              → Visualizador: navegación, teclado, swipe, foco accesible
│   ├── animations.js         → IntersectionObserver para las animaciones de scroll
│   └── app.js                → Punto de entrada: conecta todo y gestiona estados de carga
├── assets/
│   └── icons/                → Recursos gráficos propios (ej. imagen para og:image)
├── config/
│   └── config.example.js     → Copia de ejemplo de config.js con valores vacíos
└── README.md
```

**Flujo de datos:** `app.js` arranca → `drive.js` pide las fotos a
Google → `gallery.js` las pinta en el masonry con lazy loading →
`animations.js` las revela suavemente al entrar en pantalla → al hacer
clic/tap, `modal.js` abre el visualizador a pantalla casi completa con
navegación por teclado, botones y swipe.

No hay build step ni dependencias externas de npm: son archivos
estáticos que GitHub Pages sirve directamente, tal cual.
