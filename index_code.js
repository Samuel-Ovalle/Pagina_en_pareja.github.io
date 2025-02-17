/**
 * Se ejecuta cuando la página carga.
 * Verifica que todas las imágenes del documento hayan cargado antes de mostrar el botón de inicio y el reproductor de Spotify.
 */
window.onload = () => {
    let images = document.images;
    let totalImages = images.length;
    let loadedImages = 0;

    // Recorre todas las imágenes y verifica si ya están cargadas
    for (let img of images) {
        if (img.complete) {
            loadedImages++;
        } else {
            img.onload = () => {
                loadedImages++;
                // Si todas las imágenes han cargado, muestra el botón y el reproductor de Spotify
                if (loadedImages === totalImages) {
                    document.querySelector(".startBtn").style.display = "block";
                    document.querySelector(".spotify_player").style.display = "block";
                }
            };
        }
    }

    // Si ya estaban todas cargadas, muestra el botón y el reproductor de Spotify
    if (loadedImages === totalImages) {
        document.querySelector(".startBtn").style.display = "block";
        document.querySelector(".spotify_player").style.display = "block";
        random_first_song(); // Selecciona una canción aleatoria al inicio
    }
};

/**
 * Escoje una de las canciones almacenadas en "link_array" de forma aleatoria para mostrar en pantalla
 */
const random_first_song = () =>{
    let link_array = [
        "https://open.spotify.com/embed/track/1EA40FX9aBaKIXwIp83WzL?si=9003d658d84e46c6",
        "https://open.spotify.com/embed/track/3vTQ939Tlk6CXYtQgMOFUR?si=8bafb1e0dd56445e"
    ]
    let link = Math.floor(Math.random() * 2);
    document.querySelector(".spotify_player").src = `${link_array[link]}`
}

/**
 * Ejecuta pasos en secuencia al activar el evento click del boton
 * 
 */
document.querySelector(".startBtn").addEventListener("click", () => {
    // Cambia la visibilidad de elementos inicales de la pagina
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".startBtn").style.display = "none";
    document.querySelector(".spotify_player").style.display = "none";

    // Posiciona la vista inicial del usuario a la posicion del .center_view
    document.querySelector(".center_view").scrollIntoView({ behavior: "auto" });
    history.scrollRestoration = "manual";

    // Inserta en el DOM un contenedor de texto
    document.body.insertAdjacentHTML("beforeend", `
        <div class="text_container" style="display: none;">
            <p class="text-explain"></p>
        </div>
    `);
    document.querySelector(".text_container").style.display = "flex";
    let text_explain = document.querySelector(".text-explain");
    let texts = [
        "Toca la pantalla cuando termines de leer",
        "A lo largo del tiempo, la música ha sido nuestra compañera en momentos felices, tristes, de estrés o tranquilidad. Nos ha permitido dar un significado especial a cada experiencia, evocando recuerdos, despertando emociones y transportándonos a instantes que marcaron nuestra vida.",
        "Hoy quiero compartir contigo mis recuerdos y emociones. Aunque en algunos momentos no pueda estar a tu lado o apoyarte, he creado esto para que nunca te sientas sola. Siempre estaré contigo. Cada una de estas frases y canciones está dedicada a ti.",
        "Con estas frases quiero decirte que te amo como jamás he amado a nadie. Me encanta amarte con cada parte de mi ser. Tú eres por quien yo sigo en pie. Por ti lucharé, por ti me esforzaré, por ti seré mejor. Todo valdrá la pena si es por ti.",
        "TEAMOOOOO"
    ]; 
    let index = 0;

    /**
     * Cuando el usuario hace click en cualquier parte de la pantalla se cambia el texto almacenado en el array "texts" de manera secuencial
     */
    const changeText = () => {
        if (index < texts.length) {
            text_explain.textContent = texts[index];
            index++;
        } else {
            document.body.removeEventListener("click", changeText);
            songs_interactive();
        }
    };

    document.body.addEventListener("click", changeText);
});

/**
 * Genera el apartado donde el usuario podra ver todas las canciones que se mueven en secuencia
 */
const songs_interactive = () =>{
    // Se elimina el contenedor de texto
    document.querySelector(".text_container").remove()

    // Inserta en el DOM las 2 secciones que se utilizaran para serparar a las fotos
    document.body.insertAdjacentHTML("beforeend",`
        <section class="wall wall1"></section>
        <section class="wall wall2"></section>
    `)

    // Se elimina el primer elemento de spotify
    document.querySelector(".spotify_player").remove()

    /**
     * @type {numero_de_cancion[]}
     * Corta a la mitad el array de canciones
     * @param {Array} => primera mitad del array canciones
     * @param {Array} => segunda mitad del array canciones
     */
    const random_numbers = Array.from({ length: 38 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    const mitad = Math.ceil(random_numbers.length / 2);
    const fist_array = random_numbers.slice(0, mitad);
    const second_array = random_numbers.slice(mitad);

    const wall1 = document.querySelector(".wall1");
    const wall2 = document.querySelector(".wall2");

    /**
     * genera el contenedor que guardara todos los fremes individuales
     * @param {Element} wall donde se generara el contenedor de frames
     * @param {Number} id numero que determinara que imagen contendra
     * @returns Contenedor que alvergara todos los frames individuales
     */
    const createFramesContainer = (wall, id) => {
        const container = document.createElement("div");
        container.classList.add("frames");
        container.id = `${id}`;
        wall.appendChild(container);
        return container;
    };
        
    const framesContainer1 = createFramesContainer(wall1, "container_1");
    const framesContainer2 = createFramesContainer(wall2, "container_2");
        
    /**
     * Genera un frame independiente y la imagen que laverga
     * @param {Number} num numero que identifica a cada imagen
     * @param {Element} container Que contenedor alvergara al frame independiente
     */
    const create_foto = (num, container) => {
        const frame = document.createElement("div");
        frame.classList.add("frame");
        frame.innerHTML = `<img src="canciones_dedicadas/${num}.jpeg" alt="Imagen ${num}" class="song_img">`;
        container.appendChild(frame);
    };
        
    /**
     * Genera frames independientes dentro del contenedor designado, duplicandolos
     * @param {Element} container Contenedor que alvergara a los frames independientes
     * @param {Number} numbers Numero de veces que creara frames independientes
     */
    const duplicateFrames = (container, numbers) => {
        numbers.forEach(num => create_foto(num, container));
        numbers.forEach(num => create_foto(num, container));
    };
            
    duplicateFrames(framesContainer1, fist_array);
    duplicateFrames(framesContainer2, second_array);
            
    const frame_container_1 = document.getElementById("container_1")
    const frame_container_2 = document.getElementById("container_2")
    const frame = document.querySelectorAll(".frame")

    let animation_status = 1;
    let links_full_songs = [
        "https://open.spotify.com/embed/track/4ULEaep5AAmtjcyzVylNkF?si=cQFuJhM4Qryp56qK4zE0Kw&nd=1&dlsi=8d57e2d66e9d4991",
        "https://open.spotify.com/embed/track/0H3UMRVyHzmrQNYP3YQiVv?si=_ZpYiP0kQjmYDorcODiqQg&nd=1&dlsi=a838df2282694b2b",
        "https://open.spotify.com/embed/track/2UBo166T9f8BTuc5y8m7qN?si=Ahku8f31T4OSv8JZjBJA8g&nd=1&dlsi=f92da7fdd5db49ac",
        "https://open.spotify.com/embed/track/2VEZx7NWsZ1D0eJ4uv5Fym?si=1x6uo9jRR7SAV1XSrxeizQ&nd=1&dlsi=fbdfb2500a274021",
        "https://open.spotify.com/embed/track/5sa9gHsA2eTRbeTc3qAWx8?si=qLOVjq6tQw20GFkE-S3Qsw&nd=1&dlsi=af83dfb283af42c4",
        "https://open.spotify.com/embed/track/4BjBOHYl0ySaVyfGMrAnWc?si=slWSqRIzQM6sdlE0Z22kfA&nd=1&dlsi=cbc4e254e3114bb0",
        "https://open.spotify.com/embed/track/3YN5BqnqYdQVzRBjtf73r9?si=lpnWaAiZQQuLaLnXq7t0hg&nd=1&dlsi=7c093bc7c81f4d38",
        "https://open.spotify.com/embed/track/32xmmzPgQEygeYZyv4eWY8?si=qmNS-TAeT12XKMQoBCWlkA&nd=1&dlsi=22ae401b8132458e",
        "https://open.spotify.com/embed/track/0L3M4EEvRV0XozY96K7BxP?si=gNXQzDR4SR27XcE1CSW3ag&nd=1&dlsi=223189e2a6494459",
        "https://open.spotify.com/embed/track/03Ei5vvy3lOcd6TbC60jJj?si=Uu-Y5KkZQF696RVDJQq1cw&nd=1&dlsi=51af7fff508e40dd"
    ]
    
    /**
     * Detecta que frame individual fue tocado
     * Genera una imagen grande del frame que fue activado
     */
    frame.forEach(frame => {
        frame.addEventListener("click", (e) => {
            if (animation_status === 1) {
                const song_img = e.currentTarget.querySelector(".song_img");
                const songNumber = song_img.src.split('/').pop().split('.')[0];

                /**
                 * Si el frame seleccionado fue alguno con el numero identificador mayor a 28 
                 * genera un elemento spotify con el link de la cancion contenida por el frame ademas de la imagen grande al inicio
                 * Si no es un frame de numero mayor a 28 solo se genera la imagen grande al inicio
                 */
                if (songNumber > 28) {
                    let song_link = songNumber - 29

                    document.body.insertAdjacentHTML("afterbegin",`
                        <img src="canciones_dedicadas/${songNumber}.jpeg" class="new-image">
                        <iframe 
                            class="spotify_player_full"
                            src="${links_full_songs[song_link]}" 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
                        </iframe>
                        <div class="blurr_element"></div>    
                    `)
                }else{
                    document.body.insertAdjacentHTML("afterbegin",`
                        <img src="canciones_dedicadas/${songNumber}.jpeg" class="new-image">
                        <div class="blurr_element"></div>    
                    `)
                }

                frame_container_1.style.animationPlayState = "paused";
                frame_container_2.style.animationPlayState = "paused";
    
                animation_status = 0;
            }
        });
    });

    /**
     * Detecta cuando el usuario hace click en la pantalla
     * actua solo si existe la imagen grande, el blurr
     * elimina la imagen grande, el blurr y el elemento spotify solo si este ultimo exite
     */
    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("new-image") || e.target.classList.contains("blurr_element")) {
            document.querySelector(".new-image").remove();
            document.querySelector(".blurr_element").remove();
    
            const spotifyPlayer = document.querySelector(".spotify_player_full");
            if (spotifyPlayer) {
                spotifyPlayer.remove();
            }
    
            frame_container_1.style.animationPlayState = "running";
            frame_container_2.style.animationPlayState = "running";
    
            animation_status = 1;
        }
    });
}