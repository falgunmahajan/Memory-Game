

//Access DOM Elements
const cards = document.querySelectorAll(".card");
const timeTag = document.querySelector(".time");
const moveTag = document.querySelector(".move");
const restart = document.querySelector(".restart");
let start = document.querySelector(".start");
let over = document.querySelector(".over");
let win = document.querySelector(".win");
let score = document.querySelector(".score");
let renew = document.querySelector(".new");
let quit = document.querySelector(".quit");
let quitTag = document.querySelector(".quittag");
let ok=document.querySelector(".ok");
let cancel=document.querySelector(".cancel");



// initialize audio
let matchSound=new Audio("Sounds/card match.mp3");
let noMatchSound=new Audio("Sounds/buzz.mp3");
let clickSound=new Audio("Sounds/click.mp3");
let startSound=new Audio("Sounds/game Start.mp3");
let shuffleSound= new Audio("Sounds/shuffle.mp3");
let winSound=new Audio("Sounds/WINNER Sound Effect--(MP3_70K).mp3");
let overSound=new Audio("Sounds/game over.mp3");



//Event Handling for quit
quit.addEventListener("click", () => {
    quitTag.style.display="flex";
})
// for ok
ok.addEventListener("click",()=>location.href="index.html");
//for cancel
cancel.addEventListener("click",()=>quitTag.style.display="none");


// restart after game over
over.addEventListener("click", () => {
    shuffleCards();
    over.classList.remove("status");
    over.classList.add("notVisible");
});

//restart after game win
renew.addEventListener("click", () => {
    shuffleCards();
    win.classList.remove("status");
    win.classList.add("notVisible");
});
restart.addEventListener("click", shuffleCards);



// initializing variables
let maxTime =60;
let timeLeft = maxTime;
let move = 0;
let newGame = true;
let matchedCard = 0;
let card1, card2;
let disableClick = false;
let timer;
let maxScore=200;
let movePenalty=1;
let timePenalty=2;
let Userscore;

//shuffle the cards on page loading
shuffleCards();

setTimeout(() => {
    start.classList.add("notVisible");
}, 2000)
startSound.play();



// function for shuffle cards
function shuffleCards() {
    shuffleSound.play();
    timeLeft = maxTime;
    timeTag.innerHTML = `Time: ${timeLeft}s`
    clearInterval(timer);
    move = 0;
    moveTag.innerHTML = `Moves: ${move}`;
    matchedCard = 0;
    card1 = card2 = "";
    disableClick = false;
    newGame = true;
    cards.forEach((e) => {
        e.classList.remove("flip");
        const random = Math.floor(Math.random() * cards.length);
        e.style.order = random;
        e.addEventListener("click", clickedCard)
    })
}




// event handling when user click the card
cards.forEach(card => {
    card.addEventListener("click", clickedCard)
})
function clickedCard(e) {
    let clicked = e.target;
    if (newGame) {
        newGame = false;
        timer = setInterval(() => {
            //if time over
            if (timeLeft <= 0) {
                overSound.play();
                over.classList.remove("notVisible");
                over.classList.add("status");
                return clearInterval(timer);
            }
            timeLeft--;
            timeTag.innerHTML = `Time: ${timeLeft}s`
        }, 1000)
    }
    if (clicked != card1 && !disableClick && timeLeft > 0) {
        clickSound.play();
        move++;
        moveTag.innerHTML = `Moves: ${move}`;
        clicked.classList.add("flip")
        if (!card1) {
            return card1 = clicked;
        }
        card2 = clicked;
        disableClick = true;
        let card1img = card1.querySelectorAll("img")[1].src;
        let card2img = card2.querySelectorAll("img")[1].src;
        ifMatch(card1img, card2img);
    }

}

// function for card matching
function ifMatch(img1, img2) {
    if (img1 == img2) {
        setTimeout(()=>matchSound.play(),300)
        
        matchedCard++;
        if (matchedCard == (cards.length) / 2 && timeLeft > 0) {
           console.log(matchedCard)
           Userscore = maxScore-(movePenalty*move+(maxTime-timeLeft)*timePenalty);
            winSound.play();
            setTimeout(() => {
                win.classList.remove("notVisible");
                win.classList.add("status");
                score.innerHTML = `Your Score:${Userscore}`;
            },1000);
            return clearInterval(timer);
        }
        card1.removeEventListener("click", clickedCard);
        card2.removeEventListener("click", clickedCard)
        card1 = card2 = "";
        disableClick = false;
        return disableClick;
    }
    //if not match
    setTimeout(()=>noMatchSound.play(),300)
    setTimeout(() => {
        card1.classList.add("shake");
        card2.classList.add("shake");
    }, 300);
    setTimeout(() => {
        card1.classList.remove("shake", "flip");
        card2.classList.remove("shake", "flip");
        card1 = card2 = "";
        disableClick = false;
    }, 700);

}
