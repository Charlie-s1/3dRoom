import * as screenUpdate from "./screen.js";
import * as three from "./jsMod/three/src/Three.js";
const textureLoader = new three.TextureLoader();


function leg(three,colour,height,length,width){
    
    const leg = new three.Mesh(
        new three.BoxGeometry( length, width,height),
        new three.MeshLambertMaterial({color:colour})
    )
    leg.castShadow = true;
    return leg
}

function desk(three,posx,posy,posz){
    const desk = new three.Group();
    let height = 2;
    let width = 20;
    let length = 50;
    const colour = 0x4c392b;
    const top = new three.Mesh(
        new three.BoxGeometry(length,width,height),
        // new three.MeshPhongMaterial({color:0x5E3B10, shininess:50})
        new three.MeshPhongMaterial( { map:textureLoader.load("img/tableTexture2.png"),shininess:100} )

    );
    top.castShadow = true;
    top.receiveShadow = true;
    top.name = "top";
    desk.add(top);

    const BLleg = leg(three,colour,20,2,2);
    BLleg.position.z-=10;
    BLleg.position.x-=(length/2)-1.25;
    BLleg.position.y+=(width/2)-1.25;
    const BRleg = leg(three,colour,20,2,2);
    BRleg.position.z-=10;
    BRleg.position.x+=(length/2)-1.25;
    BRleg.position.y+=(width/2)-1.25;
    const FRleg = leg(three,colour,20,2,2);
    FRleg.position.z-=10;
    FRleg.position.x+=(length/2)-1.25;
    FRleg.position.y-=(width/2)-1.25;
    const FLleg = leg(three,colour,20,2,2);
    FLleg.position.z-=10;
    FLleg.position.x-=(length/2)-1.25;
    FLleg.position.y-=(width/2)-1.25;
    
    BLleg.castShadow = true;
    BRleg.castShadow = true;
    FLleg.castShadow = true;
    FRleg.castShadow = true;

    desk.add(BLleg);
    desk.add(BRleg);
    desk.add(FLleg);
    desk.add(FRleg);
    
    desk.position.set(posx,posy,posz);
    // desk.position.y = posy;
    // desk
    desk.name = "desk";
    return desk;
}

function chair(three,x,y){
    const chair = new three.Group();
    let width = 10;
    let length = 10;
    const subColour = 0x5E3b10;
    const mainColour = 0x152238;

    const seat = new three.Mesh(
        new three.BoxGeometry(length,width,2),
        new three.MeshStandardMaterial({color:mainColour})
    )
    seat.receiveShadow = true;
    seat.castShadow = true;
    seat.position.z -= 15;
    chair.add(seat); 
    const back = new three.Mesh(
        new three.BoxGeometry(length,2,10),
        new three.MeshLambertMaterial({color:mainColour})
    )
    back.receiveShadow = true;
    back.castShadow = true;
    back.position.z-=9;
    back.position.y-=5;
    back.rotation.x = Math.PI/15
    chair.add(back);

    const BLleg = leg(three,subColour,10,2,2);
    BLleg.position.z -= 20;
    BLleg.position.x-=(length/2)-1.25;
    BLleg.position.y+=(width/2)-1.25;
    chair.add(BLleg);

    const BRleg = leg(three,subColour,10,2,2);
    BRleg.position.z -= 20;
    BRleg.position.x+=(length/2)-1.25;
    BRleg.position.y+=(width/2)-1.25;
    chair.add(BRleg);

    const FLleg = leg(three,subColour,10,2,2);
    FLleg.position.z -= 20;
    FLleg.position.x+=(length/2)-1.25;
    FLleg.position.y-=(width/2)-1.25;
    chair.add(FLleg);

    const FRleg = leg(three,subColour,10,2,2);
    FRleg.position.z -= 20;
    FRleg.position.x-=(length/2)-1.25;
    FRleg.position.y-=(width/2)-1.25;
    chair.add(FRleg);
    chair.position.x=x;
    chair.position.y=y
    return chair;
}
function lightSwitch(three,x,y,z){
    const lightSwitch = new three.Group();
    lightSwitch.name = "lightSwitch";
    const base = new three.Mesh(
        new three.BoxGeometry(2,.5,3),
        new three.MeshLambertMaterial({color:0x000000})
    );
    base.castShadow = true;
    base.name = "base";
    lightSwitch.add(base);
    const button = new three.Mesh(
        new three.BoxGeometry(.5,.5,1),
        new three.MeshLambertMaterial({color:0xffffff})
    );
    button.castShadow = true;
    button.name = "button";
    button.position.y -= .25;
    button.rotation.x = Math.PI/9;
    lightSwitch.add(button)
    lightSwitch.position.set(x,y,z);
    
    return lightSwitch;
}

function monitor(three,x,y,z){
    const screenCanvas = document.createElement("canvas");
    const ctx = screenCanvas.getContext("2d");
    ctx.id = "screenCanvas";
    // ctx.canvas.width = 256;
    // ctx.canvas.height = 256;
    ctx.fillStyle = "#00ffdd";
    // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const texture = new three.CanvasTexture(ctx.canvas);
    
    const monitor = new three.Group();
    monitor.name = "monitor";

    const body = new three.Mesh(
        new three.BoxGeometry(13,.5,9),
        new three.MeshLambertMaterial({color:0x373737})
    );
    
    body.castShadow = true;
    monitor.add(body);

    const stand = new three.Mesh(
        new three.BoxGeometry(3,1,7),
        new three.MeshLambertMaterial({color:0x373737})
    );
    stand.position.y += 1;
    stand.position.z -= 3;
    stand.castShadow = true;
    monitor.add(stand);

    const screenMaterial = new three.MeshBasicMaterial({
        map: texture,
    });
    const screen = new three.Mesh(
        new three.PlaneGeometry(12, 8),
        screenMaterial
    );
    screen.name = "screen";
    screen.rotation.x = Math.PI/2;
    screen.position.y -=.26;

    monitor.position.set(x,y,z);
    monitor.add(screen);

    // const screenLight = new three.SpotLight(0x00ff66, .5);
    // // screenLight.shadow.mapSize.width = 1280;
    // // screenLight.shadow.mapSize.height = 720;
    // // screenLight.castShadow = true;
    // screenLight.target.position.set(-25,-100,-100);
    // screenLight.position.set(-25,-50,0);
    // screenLight.angle = Math.PI/5;
    // // screenLight.position.y = -21;
    // // screenLight.position.x = -10;
    // // screenLight.position.z = 20;
    // // screenLight.rotation.x = -Math.PI/2;
    // monitor.add(screenLight);
    // monitor.add(screenLight.target);

    // const helper = new three.SpotLightHelper(screenLight);
    // monitor.add(helper);

    
    monitor.position.set(x,y,z);
    
    return [monitor,ctx,texture];
}
// ./jsMod/three/examples/fonts/gentilis_regular.typeface.json
// ./jsMod/three/examples/fonts/gentilis_bold.typeface.json
// ./jsMod/three/examples/fonts/helvetiker_bold.typeface.json
// ./jsMod/three/examples/fonts/helvetiker_regular.typeface.json
// ./jsMod/three/examples/fonts/optimer_bold.typeface.json
// ./jsMod/three/examples/fonts/optimer_regular.typeface.json
function text(three,scene,text,x,y,z,size){
    const textLoad = new three.FontLoader().load('./jsMod/three/examples/fonts/helvetiker_regular.typeface.json',function(font){
        const txtMesh = new three.Mesh(    
            new three.TextGeometry(text,{
                font: font,
                size: size,
                height: .5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.05,
                bevelSegments: 3
            }),
            new three.MeshPhongMaterial({
                color:0xd4d4d4,
                shininess:150
            })
        );
        txtMesh.name = "text";
        txtMesh.position.set(x,y,z);
        txtMesh.rotation.x = Math.PI/2;
        txtMesh.castShadow = true;
        scene.add(txtMesh);
    });
}

export{desk,chair,lightSwitch,monitor,text};