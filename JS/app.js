const attr_toggle = "data-toggle";
const attr_target = "data-target";
const attr_dismiss = "data-dismiss";
const attr_tarea = "data-tarea";

const ListaTareas = document.getElementById("lista_tareas");
const tareasKey = "tareas";
const completadasKey = "Tcompletadas"

const class_modal = "modal";
const class_form = "form";
const class_show = "show";
const class_colorSuccess = "bg-succes-blurry";
const class_colorWhite = "bg-light";


const TareaForm = document.forms["nueva_tarea"];


document.addEventListener("DOMContentLoaded", function(){
    //botones que abren un modal
    let modal_open_buttons = document.querySelectorAll(`[${attr_toggle}='${class_modal}']`);

    modal_open_buttons.forEach(element =>{
        element.addEventListener("click", OpenModal);
    });

    let modal_close_buttons = document.querySelectorAll(`[${attr_dismiss}]`);

    modal_close_buttons.forEach(element =>{
        element.addEventListener("click", CloseModal);
    });

    //Agreagr tweets
    TareaForm.addEventListener("submit", agregarTarea);

    //La página termine de cargar
    mostrarTareas(tareasKey, class_colorWhite);

    //Eliminar tareas completadas
    let tarea_completada = document.querySelectorAll(`[${attr_tarea}]`);
    tarea_completada.forEach(element => {
        //obtiene el ID del elemento padre
        let parent = element.parentElement.id;
        let div_check = document.getElementById(parent);
        
        //obtiene el chekbox segun el id
        let checkbox = div_check.querySelector("input[name=Completada]");
        
        checkbox.addEventListener("change",function(){
            if (checkbox.checked) {
                completarTarea(parent);
            }
        });

    });

    let verTodo = document.getElementById("ver_todo");
    let check_ver = verTodo.querySelector("input[name=verTodo]");
    check_ver.addEventListener("change", function(){
        if (check_ver.checked) {  
            mostrarTareas(completadasKey, class_colorSuccess, "checked");
        }else{
            let tareas = ObtenerTareas(completadasKey);

            tareas.forEach(tarea => {
                let stringID = tarea[3].toString();
                removerTarea(tarea, stringID);
            });
        }
    });

});

/**
 * muestra un modal
 * @param {Pointer event} e 
 */
function OpenModal(e){
    //obetener el selstcor del elemento a mostrar
    let modal_Selector = e.target.getAttribute(attr_target);

    //obtener el elemento del DOM
    let modal = document.querySelector(modal_Selector);

    //agregar la clase para mostrar el modal
    modal.classList.add(class_show);
}


/**
 * cierra un modal
 * @param {Pointer event} e 
 */
function CloseModal(e){
    //obetener el selstcor del elemento a ocultar
    let modal_Selector = e.target.getAttribute(attr_dismiss);

    //obtener el elemento del DOM
    let modal = document.querySelector(modal_Selector);

    //quitarla clase para mostrar el modal
    modal.classList.remove(class_show);
}

function agregarTarea(e){
    //Detener el envio del formulario

    if(TareaForm["Titulo"].value === ""){
        if(document.getElementById("alerta") === null){
            const form = document.getElementById("div_form");
            const alerta = document.createElement("div");
            alerta.className = "col-auto bg-danger-lighter alert";
            alerta.innerHTML = 
                `<div class="col-auto bg-danger-lighter alert" id="alerta">
                <p class="alert-text" id="alerta-texto">Campos Incompletos</p>
            </div>`;

            document.getElementById("modal_body").insertBefore(alerta, form);
        }
        e.preventDefault();
    }else{
        //Obtener el texto del form
        const titulo = TareaForm["Titulo"].value;

        const descripcion = TareaForm["Descripcion"].value;

        const fecha = TareaForm["Fecha"].value.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3/$2/$1');

        const ID = Date.now();

        //se isnerta la tarea
        insertarTarea(titulo, fecha, descripcion, class_colorWhite);

        let arrayInfo = [titulo, descripcion, fecha, ID];

        //se guarda la tarea en local
        guardarTarea(arrayInfo, tareasKey);
        
    }
}

//guardar tarea en el local
function guardarTarea(tarea, localKey){
    let Tareas = ObtenerTareas(localKey);

    //se añade a la lista de tareas
    Tareas.push(tarea);

    //Guardar en el localstorage
    localStorage.setItem(localKey, JSON.stringify(Tareas));
}

//Obtener tareas del localstorage
function ObtenerTareas(localKey) {
    //Obtenemos los datos del localstorage
    let Tareas = localStorage.getItem(localKey);

    //Verificamos si ya existe al menos 1
    if(Tareas === null){
        Tareas = [];
    }else{
        Tareas = JSON.parse(Tareas);
    }

    return Tareas;
}

//se muestran las tareas almacenadas en local
function mostrarTareas(localKey, bgColor, checked){
    let Tareas = ObtenerTareas(localKey);
    
    Tareas.forEach(tarea => {
        insertarTarea(tarea[0], tarea[2], tarea[1], tarea[3], bgColor, checked);
    });
}

function completarTarea(id){
    let tareas = ObtenerTareas(tareasKey);
    tareas.forEach(tarea=>{
        if(id == tarea[3]){
            tareas.splice(tareas.indexOf(tarea), 1);
            localStorage.removeItem(tareasKey);
            guardarTarea(tarea, completadasKey);
            removerTarea(id);
        }
    });

    tareas.forEach(tarea=>{
        guardarTarea(tarea,tareasKey);
    });
}

function removerTarea(id){
    if(typeof(id)=="object"){
        id = id[3].toString();
    }
    let tarea = document.getElementById(id);
    let contenedor = document.getElementById("lista_tareas");
    contenedor.removeChild(tarea);
}

function insertarTarea(titulo, fecha, descripcion, ID, bgColor, checked){
    //Crear el nuevo elemento
    const nuevaTarea = document.createElement("div");

    //Añadir estilos y contenido
    nuevaTarea.className = "row center-content margin-content2";
    nuevaTarea.setAttribute("id", String(ID));
    nuevaTarea.innerHTML = 
        `<div class="col-8 ${bgColor} text-left border-top" id="tarea-container" data-tarea="tarea">
            <div class="row space-content padding-content2">
                <div class="col-auto">
                    <p class="h6">${titulo}</p>
                </div>
                <div class="col-auto">
                    <p class="text-cursiva">${fecha}</p>
                </div>
            </div>
            <div class="col-auto content-padding2">
                <p>${descripcion}</p>
            </div>

            <div class="col-auto modal-footer" style="margin-bottom:0.5em">
                <div class="auto">
                    <input type="checkbox" id="completado" name="Completada" ${checked}>
                </div>
                <div class="auto">
                    <label for="completada">Completada</label>
                </div>
            </div>
        </div>`;
    ListaTareas.appendChild(nuevaTarea);
}

