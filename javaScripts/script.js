function resizeAll() {
    var titre = document.getElementById("titre");
    titre.style.width = window.innerWidth + "px";
    titre.style.height = window.innerHeight + "px";
    titre.style.position = "absolute";
    titre.style.top = "0px";

    var transition1 = document.getElementById("transition1");
    transition1.style.width = window.innerWidth + "px";
    transition1.style.height = 0.5 * window.innerHeight + "px";
    transition1.style.position = "absolute";
    transition1.style.top = window.innerHeight + "px";

    var colorBox = document.getElementById("colorBox");
    colorBox.style.width = window.innerWidth + "px";
    colorBox.style.height = window.innerHeight + "px";
    colorBox.style.position = "absolute";
    colorBox.style.top = 1.5 * window.innerHeight + "px";

    var transition2 = document.getElementById("transition2");
    transition2.style.width = window.innerWidth + "px";
    transition2.style.height = 0.5 * window.innerHeight + "px";
    transition2.style.position = "absolute";
    transition2.style.top = 2.5 * window.innerHeight + "px";

    var game = document.getElementById("game");
    game.style.width = window.innerWidth + "px";
    game.style.height = window.innerHeight + "px";
    game.style.position = "absolute";
    game.style.top = 3 * window.innerHeight + "px";

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    pongBallPos = [canvas.width / 2, canvas.height / 2];

}

function scrollMove(event, scrollPointYs) {
    //check if can animate
    if (!canAnimate) {
        return false;
    }

    currentScroll = document.documentElement.scrollTop;

    scrollPointYs.forEach(scrollPointY => {
        scrollPointY *= window.innerHeight;
        if (event.deltaY > 0 && currentScroll < scrollPointY || //check down
            event.deltaY < 0 && currentScroll > scrollPointY) { //check up
            //prevent glitches
            canAnimate = false
            scrollDisable()
            console.log(scrollPointY)

            var scrollMagnitude = -(scrollPointY - currentScroll);

            //scrolling animation
            document.documentElement.animate(
                //keyspoints
                [{ transform: "translateY(0px)" },
                    { transform: "translateY(" + scrollMagnitude / 1.5 + "px)" },
                    { transform: "translateY(" + scrollMagnitude + "px)" }
                ],
                //specifications
                { duration: 450, iterations: 1 });


            setTimeout(() => {
                canAnimate = true;
                scrollEnable();
                document.documentElement.scrollTop = scrollPointY;
            }, 450);
        }
    });
}

function scrollDisable() {
    scrollY = document.documentElement.scrollTop;
    scrollX = document.documentElement.scrollLeft;

    window.onscroll = () => { window.scrollTo(scrollX, scrollY); };
}

function scrollEnable() {
    window.onscroll = () => {};
}

function isInRectangle(x, y, xCenter, yCenter, width, height) {
    if (Math.max(Math.abs(x - xCenter) - width, Math.abs(y - yCenter) - height) < 0) {
        return true;
    }
    return false;
}

function circleIntersectRectangle(xc, yc, radius, xr, yr, width, height) {
    //calcul extremites rectangle
    x1 = xr - width / 2;
    x2 = xr + width / 2;
    y1 = yr - height / 2;
    y2 = yr + height / 2;

    //calcul si intersection ou pas
    if (Math.abs(y1 - yc) <= radius && x1 <= xc && xc <= x2 //side detection
        ||
        (y1 - yc) ** 2 + (x1 - xc) ** 2 <= radius ** 2 || (y1 - yc) ** 2 + (x2 - xc) ** 2 <= radius ** 2 //edge detection
    ) {
        return true
    }
    if (Math.abs(y2 - yc) <= radius && x1 <= xc && xc <= x2 ||
        (y2 - yc) ** 2 + (x1 - xc) ** 2 <= radius ** 2 || (y2 - yc) ** 2 + (x2 - xc) ** 2 <= radius ** 2) {
        return true
    }
    if (Math.abs(x1 - xc) <= radius && y1 <= yc && yc <= y2 ||
        (x1 - xc) ** 2 + (y1 - yc) ** 2 <= radius ** 2 || (x1 - xc) ** 2 + (y2 - yc) ** 2 <= radius ** 2) {
        return true
    }
    if (Math.abs(x2 - xc) <= radius && y1 <= yc && yc <= y2 ||
        (x2 - xc) ** 2 + (y1 - yc) ** 2 <= radius ** 2 || (x2 - xc) ** 2 + (y2 - yc) ** 2 <= radius ** 2) {
        return true
    }
    return false
}

function planeBounceHandler(planeSpeed, planeDirection, planeRotation, bouncingObjDirection) {
    if (planeSpeed == 0) {
        return 2 * planeRotation - bouncingObjDirection;
    }
}

function mousePosHandler(e) {
    if (isPlaying) {
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
    if (!canAnimate) {
        return false;
    }

    //resetting canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

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
            x = canvas.width / 2
            y = canvas.height / 2
            pongBallDirection = Math.random() * 2 * Math.PI
        } else {
            if (x > canvas.width) {
                pongPlayerScore += 1;
                x = canvas.width / 2
                y = canvas.height / 2
                pongBallDirection = Math.random() * 2 * Math.PI
            }
        }
        //collisionLogic
        if (y < 15 || y > canvas.height - 15) {
            pongBallDirection = planeBounceHandler(0, 0, 0, pongBallDirection);
        }
        if (circleIntersectRectangle(x, y, 15, 45, pongPlayerPosY, 10, 60) ||
            circleIntersectRectangle(x, y, 15, canvas.width - 45, pongBotPosY, 10, 60)) {
            pongBallDirection = planeBounceHandler(0, 0, Math.PI / 2, pongBallDirection);
        }
        //ballMovement
        pongBallPos = [
            Math.cos(pongBallDirection) * pongBallSpeed + x,
            Math.cos(Math.PI / 2 - pongBallDirection) * pongBallSpeed + y
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
}

//global variables definition
var canAnimate = true;

var isPlaying = false;
var cursorOnButton = false;

var pongBallPos;
var pongBallSpeed = 15;
var pongBallDirection = Math.random() * 2 * Math.PI;

var pongPlayerPosY = 375;
var pongPlayerScore = 0;
var pongBotPosY = 375;
var pongBotScore = 0;

var canvas;
var context;

window.onload = function() {

    canvas = document.getElementById("gameCanvas");
    context = canvas.getContext("2d");

    resizeAll();

    //calling update in order to display 50fps
    setInterval(update, 20);
}