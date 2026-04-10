let slideIndex = 0

function trocarSlide(){

let slides = document.querySelectorAll(".slide")

slides.forEach(s => s.classList.remove("ativo"))

slideIndex++

if(slideIndex >= slides.length){
slideIndex = 0
}

slides[slideIndex].classList.add("ativo")

}

setInterval(trocarSlide, 3500)