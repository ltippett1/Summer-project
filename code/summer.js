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

//game physics
let velocity_x = -2; //pipe moving left speed
let velocity_y = 0; //bird jump speed
let gravity = 0.4; //bring bird down

let game_over = false;
let score = 0;

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
    document.addEventListener("keydown", move_bird);
}

function update() {
    requestAnimationFrame(update);
    if (game_over) {
        return;
    }
    context.clearRect(0, 0, board_width, board_height);

    //bird
    velocity_y += gravity;
    bird_y = Math.max(bird_y + velocity_y, 0); //apply gravity to current bird_y, limit the bird_y to the top of the canvas
    
    bird.y = bird_y;
    
    context.drawImage(bird_image, bird_x, bird_y, bird_width, bird_height);

    if (bird_y > board_height) {
        game_over = true;
    }

    //pipes
    for (let i = 0; i < pipe_array.length; i++) {
        let pipe = pipe_array[i];
        pipe.x += velocity_x;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    
        if (!pipe.passed && bird.x > pipe.x + pipe_width) {
            score += 0.5; //0.5 because there are 2 pipes.
            pipe.passed = true;
        }

        if (detect_collision(bird, pipe)) {
            game_over = true;
        }
    }

    //clear pipes
    while (pipe_array.length > 0 && pipe_array[0].x < -pipe_width) {
        pipe_array.shift(); //removes first element from array
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (game_over) {
        context.fillText("GAME OVER!", 5, 90);
    }
}

function place_pipes() {
    if (game_over) {
        return;
    }

    //(0-1) * pipe_height/2
    // 0 -> -128 (pipe_height/4)
    // 1 -> -128 - 256 (pipe_height/4 - pipe_height/2) = -3/4 pipe_height
    let random_pipe_y = pipe_y - pipe_height / 4 - Math.random() * (pipe_height / 2);
    let opening_space = board_height / 4;

    let top_pipe = {
        img : top_pipe_img,
        x : pipe_x,
        y : random_pipe_y,
        width : pipe_width,
        height : pipe_height,
        passed : false
    }

    pipe_array.push(top_pipe);

        let bottom_pipe = {
        img : bottom_pipe_img,
        x : pipe_x,
        y : random_pipe_y + pipe_height + opening_space,
        width : pipe_width,
        height : pipe_height,
        passed : false
    }
    
    pipe_array.push(bottom_pipe);
}

function move_bird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocity_y = -6;

        //reset game
            //restore back to default start
        if (game_over) {
            bird.y = bird_y;
            pipe_array = [];
            score = 0;
            game_over = false;
        }
    }
}

function detect_collision (a, b) {
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
}
