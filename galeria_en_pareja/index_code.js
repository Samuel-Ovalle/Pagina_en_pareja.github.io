const wall = document.querySelector(".wall");
let count_images = 23;

const numeros = Array.from({ length: count_images}, (_, i) => i + 1).sort(() => Math.random() - 0.5);
numeros.forEach(num => {
    wall.insertAdjacentHTML("beforeend", 
        `
        <div class="frame">
            <img src="fotos/${num}.jpg" alt="Imagen ${num}" class="photo">
        <div>
        `
    );
});

const possible_area_generator = (space, type)=> {
    let area = [];
    let min_area = [1, 1]
    for (let i = 1; i <= space; i++) {if (space % i === 0) area.push([space, i]);}
    area.push(min_area)

    return area;
}
const space_adjuster = (space_to_adjust, area_to_adjust, value_to_adjust, possibles_areas)=>{   
    console.log(space_to_adjust);
    

    let areas_adjust = []
    area_to_adjust.forEach((area, index) => {if (area[0]*area[1] === value_to_adjust) areas_adjust.push(index)})
    console.log(areas_adjust);
    console.log(area_to_adjust);
    
    // Obtener los valores de área de cada posible figura
    let value_adjust = [];
    possible_areas.forEach(area => value_adjust.push(area[0] * area[1]));

    // Coin change: calcular cuántas veces usar cada valor para ajustar el espacio
    const coinChangeCounts = (values, n) => {
        const dp = Array(n + 1).fill(Infinity);
        const last = Array(n + 1).fill(null);
        dp[0] = 0;

        for (let i = 1; i <= n; i++) {
            for (let v of values) {
                if (v <= i && dp[i - v] + 1 < dp[i]) {
                    dp[i] = dp[i - v] + 1;
                    last[i] = v;
                }
            }
        }

        if (dp[n] === Infinity) return null;

        const counts = {};
        let cur = n;
        while (cur > 0) {
            const v = last[cur];
            counts[v] = (counts[v] || 0) + 1;
            cur -= v;
        }

        return {
            counts,
            totalCount: dp[n]
        };
    };

    // Aplicar algoritmo para saber qué áreas usar
    const resultado = coinChangeCounts(value_adjust, Math.abs(space_to_adjust));
    if (!resultado) {
        console.warn("No se puede ajustar exactamente el espacio.");
        return;
    }

    console.log("Conteo ideal:", resultado.counts);

    // Reemplazar áreas en base al conteo obtenido
    for (let v in resultado.counts) {
        const cantidad = resultado.counts[v];
        const area_correspondiente = possible_areas.find(a => a[0] * a[1] === parseInt(v));

        for (let i = 0; i < cantidad; i++) {
            if (areas_adjust.length === 0) break; // Ya no hay más lugares que modificar
            const id_element = Math.floor(Math.random() * areas_adjust.length);
            const old_area = area_to_adjust[areas_adjust[id_element]];
            const old_area_val = old_area[0] * old_area[1];
            const new_area_val = area_correspondiente[0] * area_correspondiente[1];

            // Ajustar el espacio
            if (space_to_adjust > 0) {
                space_to_adjust -= (new_area_val - old_area_val);
            } else {
                space_to_adjust += (old_area_val - new_area_val);
            }

            // Reemplazo
            area_to_adjust[areas_adjust[id_element]] = area_correspondiente;
            areas_adjust.splice(id_element, 1);
        }
    }

    console.log("Nuevo espacio restante:", space_to_adjust);
    console.log("Resultado final de áreas:", area_to_adjust);
}
const place_object = (bytes_map, width_container, height_container, objects) => {
    const placed_objects = [];

    for (let i = 0; i < objects.length; i++) {
        const [w, h] = objects[i];
        let placed = false;

        for (let y = 0; y <= height_container - h; y++) {
            for (let x = 0; x <= width_container - w; x++) {

                // Verifica si el área está libre
                let can_place = true;
                for (let dy = 0; dy < h && can_place; dy++) {
                    for (let dx = 0; dx < w; dx++) {
                        if (bytes_map[y + dy][x + dx] !== 0) {
                            can_place = false;
                            break;
                        }
                    }
                }

                // Si se puede ubicar, marca el área y guarda coordenadas
                if (can_place) {
                    for (let dy = 0; dy < h; dy++) {
                        for (let dx = 0; dx < w; dx++) {
                            bytes_map[y + dy][x + dx] = i + 1; // Puedes usar ID u otro valor
                        }
                    }

                    placed_objects.push({
                        id: i,
                        x_start: x,
                        x_end: x + w - 1,
                        y_start: y,
                        y_end: y + h - 1
                    });

                    placed = true;
                    break;
                }
            }
            if (placed) break;
        }

        if (!placed) {
            console.warn(`No se pudo ubicar el objeto ${i} (${w}x${h})`);
        }
    }

    return placed_objects;
};

let width_container = 4;
let height_container = 16;
let full_space = height_container * width_container;
let Average_space = full_space/count_images

let ceil_space = Math.ceil(Average_space)
let floor_space = Math.floor(Average_space)
let areas = [];

if (ceil_space % 2 !== 0) ceil_space--

let possible_areas = [...possible_area_generator(ceil_space, "ceil"), ...possible_area_generator(floor_space, "floor")]

possible_areas = possible_areas.filter((item, index, self) => index === self.findIndex(t => t[0] === item[0] && t[1] === item[1]));

for (let i = 0; i < count_images; i++) {areas.push(possible_areas[Math.floor(Math.random() * possible_areas.length)])}

let used_area = 0;
areas.forEach(area => used_area += (area[0]*area[1]))

if (used_area !== full_space) {
    let space_to_adjust = full_space - used_area

    if (space_to_adjust > 0) {
        space_adjuster(space_to_adjust, areas, floor_space, possible_areas)        
    }else if (space_to_adjust < 0) {
        space_adjuster(space_to_adjust, areas, ceil_space, possible_areas)
    }
}

let bytes_map = [];
let line_bytes = [];

for (let i = 0; i < height_container; i++) {
    for (let i = 0; i < width_container; i++) {line_bytes.push(0)}
    bytes_map.push(line_bytes)
    line_bytes = [];
}

const positioned = place_object(bytes_map, width_container, height_container, areas);

console.log(bytes_map);

const frames = Array.from(document.querySelectorAll(".frame"));

// Recorremos cada objeto colocado y le asignamos su área en el grid:
positioned.forEach(obj => {
  const { id, x_start, x_end, y_start, y_end } = obj;
  const frame = frames[id];
  // En CSS Grid, las líneas empiezan en 1. grid-line-end es exclusiva,
  // por eso sumamos +1 al índice final.
  frame.style.gridColumnStart =  x_start + 1;
  frame.style.gridColumnEnd   =  x_end   + 2;
  frame.style.gridRowStart    =  y_start + 1;
  frame.style.gridRowEnd      =  y_end   + 2;
});