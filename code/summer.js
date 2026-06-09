//board
let board;
//Same dimensions as background image
let board_width = 360;
let board_height = 640;
let context;

//bird
let bird_width = 34;
let bird_height = 24;
let bird_x = board_width / 8;
let bird_y = board_height / 2;
let bird_image;

let bird = {
    x : bird_x,
    y : bird_y,
    width : bird_width,
    height : bird_height
}

//pipes
let pipe_array = [];
let pipe_width = 64;
let pipe_height = 512;
let pipe_x = board_width;
let pipe_y = 0;

let top_pipe_img;
let bottom_pipe_img;

window.onload = function() {
    board = document.getElementById("board");
    board.height = board_height;
    board.width = board_width;
    //Draw on the board
    context = board.getContext("2d");

    //Draw the bird
        //load image
    bird_image = new Image();
    bird_image.src = "../images/flappybird.png";
    bird_image.onload = function() {
        context.drawImage(bird_image, bird_x, bird_y, bird_width, bird_height);
    }

    top_pipe_img = new Image();
    top_pipe_img.src = "../images/toppipe.png";

    bottom_pipe_img = new Image();
    bottom_pipe_img.src = "../images/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(place_pipes, 1500); //every 1.5 seconds
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board_width, board_height);

    //bird
    context.drawImage(bird_image, bird_x, bird_y, bird_width, bird_height);
}

function place_pipes() {

}
