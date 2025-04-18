document.querySelectorAll(".objeto_enlace").forEach(element =>{
    element.addEventListener("click", ()=>{
        window.location.href = `${element.id}/content.html`
    })
})