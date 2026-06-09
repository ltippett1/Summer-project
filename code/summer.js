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

window.onload = function() {
    board = document.getElementById("board");
    board.height = board_height;
    board.width = board_width;
    //Draw on the board
    context = board.getContext("2d");

    //Draw the bird
    context.fillStyle = "green";
    context.fillRect(bird_x, bird_y, bird_height, bird_width);

        //load image
    bird_image = new Image();
    bird_image.src = "../images/flappybird.png"
    bird_image.onload = function() {
        context.drawImage(bird_image, bird_x, bird_y, bird_width, bird_height);
    }
}