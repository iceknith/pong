function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    if (!isPlaying) {
        pongBallPos = [canvas.width / 2, canvas.height / 2];
    }
}

function isInRectangle(x, y, xCenter, yCenter, width, height) {
    if (Math.max(Math.abs(x - xCenter) - width, Math.abs(y - yCenter) - height) < 0) {
        return true;
    }
    return false;
}

function isInCircle(x, y, xCenter, yCenter, radius) {
    return (x - xCenter) ** 2 + (y - yCenter) ** 2 <= radius ** 2
}
function circleIntersectRectangle(xc, yc, radius, xr, yr, width, height) {

    //calcul extremites rectangle
    x1 = xr - width / 2;
    x2 = xr + width / 2;
    y1 = yr - height / 2;
    y2 = yr + height / 2;

    function sideDetection(cPos1, cPos2, radius, edge1, edge2, pos) {
        return Math.abs(pos - cPos1) <= radius && edge1 <= cPos2 && cPos2 <= edge2
    }
    //calcul si intersection ou pas
    if (sideDetection(yc, xc, radius, x1, x2, y1)) {
        pongLastCollisionDirection = - Math.PI;
        return true
    }
    if (sideDetection(yc, xc, radius, x1, x2, y2)) {
        pongLastCollisionDirection = - Math.PI;
        return true
    }
    if (sideDetection(xc, yc, radius, y1, y2, x1)) {
        pongLastCollisionDirection = Math.PI / 2;
        return true
    }
    if (sideDetection(xc, yc, radius, y1, y2, x2)) {
        pongLastCollisionDirection = Math.PI / 2;
        return true
    }
    if (isInCircle(x1, y1, xc, yc, radius)) {
        pongLastCollisionDirection = 3 * Math.PI / 4;
        return true
    }
    if (isInCircle(x2, y1, xc, yc, radius)) {
        pongLastCollisionDirection = Math.PI / 4;
        return true
    }
    if (isInCircle(x1, y2, xc, yc, radius)) {
        pongLastCollisionDirection = 5 * Math.PI / 4;
        return true
    }
    if (isInCircle(x2, y2, xc, yc, radius)) {
        pongLastCollisionDirection = 7 * Math.PI / 2;
        return true
    }
    return false
}

function planeBounceHandler(planeRotation, bouncingObjDirection) {
    pongBallSpeed += 0.1;
    return 2 * planeRotation - bouncingObjDirection;
}

function mousePosHandler(e) {
    if (isPlaying && !circleIntersectRectangle(pongBallPos[0], pongBallPos[1], 15, 45, e.offsetY, 8, 58)) {
        pongPlayerPosY = e.offsetY;
    } else {
        //verifie si le curseur est dans le bouton play
        if (isInRectangle(e.offsetX, e.offsetY, canvas.width / 2, canvas.height / 2 - 200, 150, 50)) {
            cursorOnButton = true;
        } else {
            cursorOnButton = false;
        }
    }
}

function mouseClickHandler() {
    if (cursorOnButton) {
        isPlaying = true;
    }
}

function update() {
    //resetting canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    //defining delta time
    time1 = new Date().getTime();
    deltaTime = time1 - time0;
    time0 = time1;

    if (isPlaying) {

        //--drawing everything--//
        context.fillStyle = "white";
        //player
        context.fillRect(40, pongPlayerPosY - 30, 10, 60)
        //bot
        context.fillRect(canvas.width - 50, pongBotPosY - 30, 10, 60)
        //scores
        context.font = '100px retro';
        context.fillText(pongPlayerScore, 100, 100)
        context.fillText(pongBotScore, canvas.width - 150, 100)
        //ball
        context.beginPath();
        context.arc(pongBallPos[0], pongBallPos[1], 15, 0, 2 * Math.PI)
        context.fill();
        context.closePath();

        //--GameLogic--//
        x = pongBallPos[0]
        y = pongBallPos[1]
        //scoreLogic
        if (x < 0) {
            pongBotScore += 1;
            x = canvas.width / 2;
            y = canvas.height / 2;
            pongBallDirection = Math.random() * Math.PI / 3 + values[Math.floor(Math.random() * 4)];
            pongBallSpeed = 6;
        } else {
            if (x > canvas.width) {
                pongPlayerScore += 1;
                x = canvas.width / 2
                y = canvas.height / 2
                pongBallDirection = Math.random() * Math.PI / 3 + values[Math.floor(Math.random() * 4)];
                pongBallSpeed = 6;
            }
        }
        //collisionLogic
        if (y < 15) {
            pongBallDirection = planeBounceHandler(0, pongBallDirection);
            y = 15;
        }
        else {
            if (y > canvas.height - 15) {
                pongBallDirection = planeBounceHandler(0, pongBallDirection);
                y = canvas.height - 15;
            }
        }
        if (circleIntersectRectangle(x, y, 15, 45, pongPlayerPosY, 10, 60) ||
            circleIntersectRectangle(x, y, 15, canvas.width - 45, pongBotPosY, 10, 60)) {
            pongBallDirection = planeBounceHandler(pongLastCollisionDirection, pongBallDirection);
        }
        //ballMovement
        pongBallPos = [
            Math.cos(pongBallDirection) * pongBallSpeed * deltaTime / 15 + x,
            Math.cos(Math.PI / 2 - pongBallDirection) * pongBallSpeed * deltaTime / 15 + y
        ];

        //IA Logic
        pongBotPosY = y;
    } else {
        //drawing everything
        //play button
        if (cursorOnButton) {
            context.fillStyle = "gray";
            context.font = '70px retro';
        } else {
            context.fillStyle = "white";
            context.font = '68px retro';
        }
        context.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 250, 300, 100);
        context.fillStyle = "black";
        context.fillText('Play', canvas.width / 2 - 75, canvas.height / 2 - 180);
    }
    window.requestAnimationFrame(update)
}

//global variables definition

var isPlaying = false;
var cursorOnButton = false;
var time0;
var time1;

var pongBallPos;
var pongBallSpeed = 6;
const values = [0, 2 * Math.PI / 3, 3 * Math.PI / 3, 5 * Math.PI / 3]
var pongBallDirection = Math.random() * Math.PI / 3 + values[Math.floor(Math.random() * 4)];
var pongLastCollisionDirection;

var pongPlayerPosY = 375;
var pongPlayerScore = 0;
var pongBotPosY = 375;
var pongBotScore = 0;

var canvas;
var context;

window.onload = function () {

    canvas = document.getElementById("gameCanvas");
    context = canvas.getContext("2d");

    resizeCanvas();

    //calling update in order to display & update the canvas
    window.requestAnimationFrame(update);
}