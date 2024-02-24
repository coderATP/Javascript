
//akaka(ajjsjsjwwjj#hhwh^bwbbsbsbbsbsbbsbb#bbsbssnbsbssbsbsbsbbsbsbbsbsbsbbsbsbsbbsbsbbssbbsbsznbshsbsbbsbsb)
class Game{
    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.states = {
            idle: new Idle(this), 
            charge: new Charge(this), 
            swarm: new Swarm(this)
        }
        this.alien = this.states['idle'];
        this.alien.start();
        
        //keys
        this.keys = new Set();
        this.keypressed = false;
        const btns = document.querySelectorAll('button');
        btns.forEach(btn=>{
            btn.addEventListener('touchstart', (e)=>{
                this.keypressed = true;
                this.keys.add(e.target.id);
            })
            btn.addEventListener('touchend', (e)=>{
                this.keypressed = false;
                this.keys.clear();
            })
            
        })
        
        //text
        this.info = document.getElementById('info');
    }
    
    setAlienState(state){
        this.alien = this.states[state];
        this.alien.start();
    }
    
    render(ctx){
        this.alien.draw(ctx);
    }
    update(ctx, deltaTime){
        this.alien.update(ctx, deltaTime)
    }
}

class Alien{
    constructor(game){
        this.game = game;
        this.width = 200;
        this.height = 80;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height * 0.5 - this.height * 0.5;
        this.color = 'black';
        
        this.counter = 10000;
    }
    
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Idle extends Alien{
    start(){
        this.color = 'red';
        this.counter = 10000;
    }
    update(ctx, deltaTime){
        this.game.info.innerText = 'IDLE! Press C to charge or S to swarm';
        if(this.game.keys.has('charge') && this.game.keypressed){
            this.game.info.innerText = 'Charging'
            this.game.setAlienState('charge');
            this.game.keypressed = false;
        }
        else if(this.game.keys.has('swarm') && this.game.keypressed){
            this.game.info.innerText = 'Swarming! Press I \n or wait for '+this.counter/1000 +
            ' seconds to automatically switch back to Idle';
            
            this.game.setAlienState('swarm');
            this.game.keypressed = false;
        }  
    }
}
class Charge extends Alien{
    start(){
        this.color = 'green';
        this.game.info.innerText = 'CHARGING! Press S to swarm';
    }
    update(ctx, deltaTime){
        if(this.game.keys.has('swarm') && this.game.keypressed){
            this.game.setAlienState('swarm');
            this.game.keypressed = false;
        }
        else if(this.game.keys.has('idle')){
            this.game.info.innerText = 'You cannot switch to Idle, press S to swarm';
        }
    }
}
class Swarm extends Alien{
    start(){
        this.color = 'blue';
        this.counter = 10000;
        this.game.info.innerText = 'Swarming! Press I \n or wait for '+this.counter/1000 +
            ' seconds to automatically switch back to Idle';
    }
    update(ctx, deltaTime){
        ctx.font = '30px Impact';
        ctx.fillText(Math.floor(this.counter/1000) , 10, 30)
        this.counter-= deltaTime;
        if(this.counter <= 0){
            this.game.setAlienState('idle');
            this.game.info.innerText = 'Idle';
        }
        else if(this.game.keys.has('idle')){
            this.game.setAlienState('idle');
            this.game.info.innerText = 'Idle';
        }
        else if(this.game.keys.has('charge')){
            this.game.info.innerText = 'You cannot switch to Charge, \n Press I to idle'
        }
    }
}


addEventListener('load', ()=>{
    canvas.width = 800;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    
    const game = new Game(canvas);
    
    let timestart = 0, deltaTime = 0;
    function loop(timestamp ){
        deltaTime = timestamp - timestart;
        timestart = timestamp;
        
        ctx.clearRect(0,0, canvas.width, canvas.height);
        
        game.render(ctx);
        game.update(ctx, deltaTime);
        
        requestAnimationFrame(loop);
    }
    loop()
    
    
})