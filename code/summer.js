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

let pipe_interval;

//game physics
let velocity_x = -2; //pipe moving left speed
let velocity_y = 0; //bird jump speed
let gravity = 0.4; //bring bird down

let game_over = false;
let score = 0;

//level
let level = "easy";
let game_started = false;

let easy_gap = 220;
let medium_gap = 170;
let hard_gap = 120;

//restart
let game_loop_started = false;

let waiting_to_start = false;

//coin
let coin_img;
let coin_array = [];
let coin_width = 32;
let coin_height = 32;

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

    coin_img = new Image();
    coin_img.src = "../images/coin.png";

    document.addEventListener("keydown", move_bird);

    //Select level
    document.getElementById("easy-button").addEventListener("click", function() {
        level = "easy";
        start_game()
    });

    document.getElementById("medium-button").addEventListener("click", function() {
        level = "medium";
        start_game()
    });

    document.getElementById("hard-button").addEventListener("click", function() {
        level = "hard";
        start_game()
    });

    document.getElementById("restart-button").addEventListener("click", function() {
        restart_game();
    });

    document.getElementById("new-level-button").addEventListener("click", function() {
        choose_new_level();
    })
}

function start_game() {
    document.getElementById("level-select").style.display = "none";
    document.getElementById("game-over").style.display = "none";

    game_started = true;
    game_over = false;
    waiting_to_start = true;

    pipe_array = [];
    score = 0;
    bird_y = board_height / 2;
    bird.y = bird_y;
    velocity_y = 0;

    clearInterval(pipe_interval);
    
    if (!game_loop_started) {
        game_loop_started = true;
        requestAnimationFrame(update);
}
}

function update() {
    requestAnimationFrame(update);
    if (game_over) {
        return;
    }
    context.clearRect(0, 0, board_width, board_height);

    //bird
    if (!waiting_to_start) {
        velocity_y += gravity;
        bird_y = Math.max(bird_y + velocity_y, 0); //apply gravity to current bird_y, limit the bird_y to the top of the canvas
    }

    bird.y = bird_y;
    
    context.drawImage(bird_image, bird_x, bird_y, bird_width, bird_height);

    if (bird_y + bird_height > board_height) {
        game_over = true;
        show_game_over();
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
            show_game_over();
        }
    }

    //clear pipes
    while (pipe_array.length > 0 && pipe_array[0].x < -pipe_width) {
        pipe_array.shift(); //removes first element from array
    }

    //coins
    for (let i = 0; i < coin_array.length; i++) {
        let coin = coin_array[i];

        coin.x += velocity_x;

        context.drawImage(
            coin.img,
            coin.x,
            coin.y,
            coin.width,
            coin.height
        );

        if (!coin.collected && detect_collision(bird, coin)) {
            score += 1;
            coin.collected = true;
        }
    }

    //clear coin
    while (coin_array.length > 0 &&
        (coin_array[0].x < -coin_width || coin_array[0].collected)) {
            coin_array.shift();
        }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
}

function place_pipes() {
    if (game_over) {
        return;
    }

    //(0-1) * pipe_height/2
    // 0 -> -128 (pipe_height/4)
    // 1 -> -128 - 256 (pipe_height/4 - pipe_height/2) = -3/4 pipe_height
    let random_pipe_y = pipe_y - pipe_height / 4 - Math.random() * (pipe_height / 2);
    
    let opening_space;

    if (level === "easy") {
        opening_space = easy_gap;
    } else if (level === "medium") {
        opening_space= medium_gap;
    } else if (level === "hard") {
        opening_space = hard_gap;
    }

    let top_pipe = {
        img : top_pipe_img,
        x : pipe_x,
        y : random_pipe_y,
        width : pipe_width,
        height : pipe_height,
        passed : false
    };

    pipe_array.push(top_pipe);

    let bottom_pipe = {
        img : bottom_pipe_img,
        x : pipe_x,
        y : random_pipe_y + pipe_height + opening_space,
        width : pipe_width,
        height : pipe_height,
        passed : false
    };
    
    pipe_array.push(bottom_pipe);

    //random position between coins inside the pipe gap
    let coin_y = random_pipe_y + pipe_height;

    coin_y += Math.random() * (opening_space - coin_height);

    let coin = {
        img : coin_img,
        x : pipe_x + pipe_width / 2 - coin_width / 2,
        y : coin_y,
        width : coin_width,
        height : coin_height,
        collected : false
    };

    coin_array.push(coin);
}

function move_bird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {

        if (waiting_to_start) {
            waiting_to_start = false;

            pipe_interval = setInterval(place_pipes, 1500);
        }

        velocity_y = -6;
     }
}

function detect_collision (a, b) {
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
} 

function show_game_over() {
    document.getElementById("final-score").textContent = score;
    document.getElementById("game-over").style.display = "flex";
}

function restart_game() {
    document.getElementById("game-over").style.display = "none";

    bird_y = board_height / 2;
    bird.y = bird_y;

    velocity_y = 0;
    pipe_array = [];
    coin_array = [];
    score = 0;
    game_over = false;
    game_started = true;
    waiting_to_start = true;

    clearInterval(pipe_interval);
}

function choose_new_level() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("level-select").style.display = "flex";

    bird_y = board_height / 2;
    bird.y = bird_y;

    velocity_y = 0;
    pipe_array = [];
    coin_array = [];
    score = 0;
    game_over = true;
    game_started = false;

    clearInterval(pipe_interval);
}
