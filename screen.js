let x = 10;
let y = 10;
let xdir = 1;
let ydir = 1;
let sleep = true;
let useKeyboard = false;
const text = "Space to start";

function writeOnCanvas(ctx,desktopCtrl){
    useKeyboard = desktopCtrl;
    ctx.font = "15px"
    ctx.fillStyle = "#00ff00";
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)

    if (sleep){
        if (x > ctx.canvas.width-(text.length*4.7)){
            xdir = -1
        }else if(x<0){
            xdir = 1;
        }
        if (y>ctx.canvas.height-.5){
            ydir = -1;
        }else if(y<8){
            ydir = 1
        }
        ctx.fillText(text,x+=xdir,y+=ydir);
    }else{
        ctx.fillText("ESC to quit",(ctx.canvas.width/2)-25,(ctx.canvas.height/2)-3);
    }
    
}
window.addEventListener("keydown",(e) => {
    if (useKeyboard && e.key == " "){
        sleep = false;
    }
    if (useKeyboard && e.key == "Escape"){
        sleep=true;
    }
    console.log(e);
});



export{writeOnCanvas};