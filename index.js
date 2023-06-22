//conectando con el canvas
const canvas = document.querySelector('canvas');
//agregando contexto de 2 dimensiones
const c = canvas.getContext('2d');
//agregando tamaño del canvas
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)
//Grabedad
const gravity = 0.7;
//creando jugador enemigo y enemigo

const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc:'./Assets/background.png'
})

const shop = new Sprite({
    position:{
        x:600,
        y:128
    },
    imageSrc:'./Assets/shop.png',
    scale:2.75,
    framesMax: 6
})
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity:{
        x: 0,
        y: 0
    },
    offset:{
        x: 0,
        y: 0
    },
    imageSrc: './Assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset:{
        x: 215,
        y: 160
    },
    sprites:{
        idle : {
            imageSrc: './Assets/samuraiMack/Idle.png',
            framesMax: 8
        },
        run:{
            imageSrc:'./Assets/samuraiMack/Run.png',
            framesMax: 8
        },
        jump:{
            imageSrc:'./Assets/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc:'./Assets/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc:'./Assets/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit:{
            imageSrc:'./Assets/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death:{
            imageSrc:'./Assets/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox:{
        offset:{
            x: 100,
            y: 50
        },
        width:140,
        height: 50
    }
})

const enemy = new Fighter ({
    position: {
        x: 400,
        y: 0
    },
    velocity:{
        x: 0,
        y: 0
    },
    color : 'yellow',
    offset:{
        x: -50,
        y: 0
    },
    imageSrc: './Assets/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset:{
        x: 215,
        y: 167
    },
    sprites:{
        idle : {
            imageSrc: './Assets/kenji/Idle.png',
            framesMax: 4
        },
        run:{
            imageSrc:'./Assets/kenji/Run.png',
            framesMax: 8
        },
        jump:{
            imageSrc:'./Assets/kenji/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc:'./Assets/kenji/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc:'./Assets/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit:{
            imageSrc: './Assets/kenji/Take hit.png',
            framesMax: 3
            
        },
        death:{
            imageSrc:'./Assets/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox:{
        offset:{
            x: -170,
            y: 50
        },
        width:170,
        height: 50
    }
})

const keys = {
    a:{
        pressed: false
    }, 
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
    
}



decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255,255,255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0
    //player movement 

    if (keys.a.pressed && player.lastkey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    }else if (keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    }else{
        player.switchSprite('idle')
    }
    //jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    }else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //Enemy movement 
    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')

    }else if (keys.ArrowRight.pressed && lastkey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }else{
        enemy.switchSprite('idle')
    }

    //jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //Detect for collision & enemy gets hit

    if( rectangularCollision({
        rectangle1: player,
        rectangle2 : enemy,
    }) &&
        player.isAttacking && player.framesCurrent === 4){
        enemy.takeHit()
        player.isAttacking = false 
        //document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    //if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    //detectec for collision & enemy gets hit

    if( rectangularCollision({
        rectangle1: enemy,
        rectangle2 : player,
    }) &&
        enemy.isAttacking && enemy.framesCurrent === 2){
        player.takeHit()
        enemy.isAttacking = false 
        //document.querySelector('#playerHealth').style.width = player.health + '%'
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

        //if player misses
        if (enemy.isAttacking && enemy.framesCurrent === 2) {
            enemy.isAttacking = false
        }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    } 
}

animate()

//Eventos del teclado 

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastkey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastkey = 'a'
        break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break
    }
}
    if (!enemy.dead) {
        switch(event.key){
            //moviento enemigo o rival 
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastkey =  'ArrowRight'
                lastkey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastkey =  'ArrowLeft'
                lastkey = 'ArrowLeft'
            break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                enemy.attack()
                break                
            default:
                break;
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
    
        case 'a':
            keys.a.pressed = false
            break

        
        default:
            break;
    }

    //enemy keys 
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
    
        default:
            break;
    }
})