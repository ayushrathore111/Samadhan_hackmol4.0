var img = document.getElementById('img');


var slides = ['img1.jpeg', 'img2.jpg', 'img3.jpg', 'img4.jpg'];


var Start = 0;

function slider() {
    if (Start < slides.length) {
        Start = Start + 1;
    } else {
        Start = 1;
    }
    console.log(img);
    img.innerHTML = "<img src=" + slides[Start - 1] + ">";

}
var img = document.getElementById('img');

var slides = ['img1.jpeg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img4.jpg'];


var Start = 0;

function slider() {
    if (Start < slides.length) {
        Start = Start + 1;
    } else {
        Start = 1;
    }
    console.log(img);
    img.innerHTML = "<img src=" + slides[Start - 1] + ">";

}
setInterval(slider, 1000);