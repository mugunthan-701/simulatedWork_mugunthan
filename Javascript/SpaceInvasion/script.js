const grid = document.querySelector('.grid')
const resultDisplay = document.querySelector('.results')
let currentShooterIndex = 202
let width = 15
let direction = 1
let invadersId
let aliensRemoved=[]
let goingRight=true
let results = 0
for(let i=0;i<225;i++){
    const square = document.createElement('div')
    grid.appendChild(square)
}
const squares = Array.from(document.querySelectorAll('.grid div'))
const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

function draw(){
    for(let i=0;i<alienInvaders.length;i++){
        if(!aliensRemoved.includes(i)){
            squares[alienInvaders[i]].classList.add('invader')
        }
        
    }
    if(aliensRemoved.length===alienInvaders.length){
        resultDisplay.innerHTML='YOU WIN!'
        clearInterval()
    }
}
draw()

function removeInvader(){
    for(let i=0;i<alienInvaders.length;i++){
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

squares[currentShooterIndex].classList.add('shooter')

function moveShooter(e){
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key){
        case 'a':
            if(currentShooterIndex% width !==0){
                currentShooterIndex -=1
            }
            break
        case 'd':
            if(currentShooterIndex % width<width-1){
                currentShooterIndex +=1
            }
            break
    }
    squares[currentShooterIndex].classList.add('shooter')
}
document.addEventListener('keydown',moveShooter)

function moveInvaders(){
    const leftEdge=alienInvaders[0]%width===0
    const rightEdge=alienInvaders[alienInvaders.length-1]% width === width -1
    removeInvader()
    if(rightEdge && goingRight){
        for(let i =0;i<alienInvaders.length;i++){
            alienInvaders[i]+=width+1
            direction = -1
            goingRight=false 
        }
    }

    if(leftEdge && !goingRight){
        for(let i =0;i<alienInvaders.length;i++){
            alienInvaders[i]+=width -1
            direction = 1
            goingRight=true
        }
    }
    
    for (let i=0;i<alienInvaders.length;i++){
        alienInvaders[i]+=direction
    }
    draw()

    if(squares[currentShooterIndex].classList.contains('invader','shooter')){
        console.log('game over!')
        clearInterval(invadersId)
    }

    for(let i = 0;i<alienInvaders.length;i++){
        if(alienInvaders[i]>(squares.length-width)){
        resultDisplay.innerHTML = 'GAME OVER!'
        clearInterval(invadersId)
        }
    }
}

invadersId=setInterval(moveInvaders,100)

function shoot(e){
    let laserId
    let currentLaserIndex = currentShooterIndex
    function moveLaser(){
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')

        if(squares[currentLaserIndex].classList.contains('invader')){
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300)
            clearInterval(laserId)

            let index = alienInvaders.indexOf(currentLaserIndex)
            if (index !== -1) {  
                aliensRemoved.push(alienInvaders[index]) // Store the actual invader position
                alienInvaders.splice(index, 1) // Remove invader from array
            }

            results++ 
            resultDisplay.innerHTML = results
        }
    }

    switch(e.key){
        case 'w':
            laserId = setInterval(moveLaser, 100)
    } 
}
 
document.addEventListener('keydown',shoot)