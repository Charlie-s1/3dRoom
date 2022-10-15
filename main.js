import * as three from "./jsMod/three/src/Three.js";
import {OrbitControls} from "./jsMod/three/examples/jsm/controls/MyOrbitControls.js";
// import {RectAreaLightUniformsLib} from './jsMod/three/examples/jsm/lights/RectAreaLightUniformsLib.js';
// import {RectAreaLightHelper} from './jsMod/three/examples/jsm/helpers/RectAreaLightHelper.js';
import * as myObjs from "./obj.js";
import * as screenScript from "./screen.js";

document.addEventListener("click",onclick);
document.addEventListener("mousemove",onHover);
document.querySelector("#closeHelp").addEventListener("click",(e)=>{
    document.querySelector("#helpScreen").style.display="none";
})

let clickable = [];
const raycaster = new three.Raycaster();
const mouse = new three.Vector2();
const textureLoader = new three.TextureLoader();
let objTarget = {x:0,y:0,z:0};
let screenCtx;
let screenCanvas;
let desktopCtrl = false;
let toMove = [];

let aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 960;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new three.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

camera.up.set(0,0,1);
camera.position.set(-200, -200, 100);
camera.lookAt(0,0,0);

const scene = new three.Scene();

const renderer = new three.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMapType = three.PCFSoftShadowMap;
renderer.setClearColor( 0x171c21, 1);
renderer.id = "canvas";

document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement)
controls.mouseButtons = {
    LEFT:null,
    MIDDLE:three.MOUSE.ROTATE,
    RIGHT:three.MOUSE.ROTATE
}
controls.minAzimuthAngle = - 1.7; 
controls.maxAzimuthAngle = .15; 
controls.minDistance = 25;
controls.maxPolarAngle = Math.PI/2.3;  
controls.minDistance = 25;
controls.maxDistance = 400;
controls.rotateSpeed = 0.25;

controls.screenSpacePanning = true;
const ambientLight = new three.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const dirLight = new three.PointLight(0xffffff, .5);
dirLight.position.set(0, 0, 40);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1280;
dirLight.shadow.mapSize.height = 720;
scene.add(dirLight);

const redLight = new three.PointLight(0xff0000, 0);
redLight.position.set(45, -60, -10);
redLight.shadow.mapSize.width = 1280;
redLight.shadow.mapSize.height = 720;
redLight.castShadow = true;
scene.add(redLight);
const blueLight = new three.PointLight(0x0000ff,0);
blueLight.position.set(-45, -60, -10);
blueLight.shadow.mapSize.width = 1280;
blueLight.shadow.mapSize.height = 720;
blueLight.castShadow = true;
scene.add(blueLight);

const woodTexture =new three.TextureLoader().load("img/woodTexture.jpg");
woodTexture.wrapS = three.RepeatWrapping;
woodTexture.wrapT = three.RepeatWrapping;
woodTexture.repeat.set(2,2)

const floorGeometry = new three.PlaneGeometry(100, 100);
const wallGeometry = new three.PlaneGeometry(75, 100);
const floorMaterial = new three.MeshPhongMaterial({ 
    map:woodTexture,
    shininess:50
});
// const floorMaterial = new three.MeshStandardMaterial( { color: 0x3c280d} )
const wall1Material = new three.MeshStandardMaterial( { color: 0xffffff} )
const wall2Material = new three.MeshStandardMaterial( { color: 0xfd5e53} )
// const wall2Material = new three.MeshStandardMaterial( { color: 0xfd5e53} )

const plane = new three.Mesh( floorGeometry, floorMaterial );
const plane2 = new three.Mesh( wallGeometry, wall1Material );
const plane3 = new three.Mesh( wallGeometry, wall2Material );
plane.receiveShadow = true;
plane2.receiveShadow = true;
plane3.receiveShadow = true;


plane.receiveShadow = true;
plane.position.z=-25;
scene.add( plane );

plane2.rotation.x = Math.PI/2;
plane2.rotation.z = Math.PI/2;
plane2.position.y = 50;
plane2.position.z = 12.5;
scene.add(plane2);

plane3.rotation.y = -Math.PI/2;
plane3.position.x = 50;
plane3.position.z = 12.5;
scene.add(plane3);

// const monitorGroup = myObjs.monitor(three,25,40,160);
const monitorGroup = myObjs.monitor(three,25,45,2);
const monitor = monitorGroup[0];
screenCtx = monitorGroup[1];
screenCanvas = monitorGroup[2];
for (let i of monitor.children){
    clickable.push(i);
}
monitor.finalPos = 2;
monitor.axisToMove = "z";
toMove.push(monitor);
scene.add(monitor)

// const desk = myObjs.desk(three,-150,36.5,-5);
const desk = myObjs.desk(three,23.7,38,-5);
desk.receiveShadow = true;
desk.axisToMove = "x";
desk.finalPos = 23.7;
scene.add(desk);
toMove.push(desk);

// const chair = myObjs.chair(three,23.7,-150);
const chair = myObjs.chair(three,25,28);
chair.finalPos = 20;
chair.axisToMove = "y";
scene.add(chair);
toMove.push(chair);

const lSwitch =  myObjs.lightSwitch(three,-45,50,15);
for (let i of lSwitch.children){
    clickable.push(i);
}
scene.add(lSwitch);



let textList = [];
// myObjs.text(three,scene,"Charlie",-45,50,37,7);
// myObjs.text(three,scene,"Smith",-45,50,28,7);
// myObjs.text(three,scene,"github.com/charlie-s1",-45,50,21,4);
const fName = myObjs.text(three,scene,"Charlie",-45,50,37,7);
scene.add(fName);
const lName = myObjs.text(three,scene,"Smith",-45,50,28,7);
scene.add(lName);
const link = myObjs.text(three,scene,"github.com/charlie-s1",-45,50,21,4,true);
link.link = "github.com/charlie-s1"
scene.add(link);
for(let i of link.children){
    clickable.push(i);
}

const animate = function () {
    // for (let i of textList){
    //     if (i.position.y > 50){
    //         i.position.y -= .01;
    //     }
    // }
    // let objMoveSpeed = 4;
    // for (let i of toMove){
    //     if(i.position[i.axisToMove]<i.finalPos-6 || i.position[i.axisToMove]>i.finalPos+6){

    //         if(i.position[i.axisToMove]<i.finalPos-4){
    //             i.position[i.axisToMove]+=objMoveSpeed;
    //         }else if(i.position[i.axisToMove]>i.finalPos+4){
    //             i.position[i.axisToMove]-=objMoveSpeed;
    //         }
    //     }else{

    //         if(i.position[i.axisToMove]<i.finalPos-.1){
    //             i.position[i.axisToMove]+=.1;
    //         }else if(i.position[i.axisToMove]>i.finalPos+.1){
    //             i.position[i.axisToMove]-=.1;
    //         }
    //     }

    // }

    changeCamTarget(objTarget);

    requestAnimationFrame( animate );
    
    if (objTarget.x != 0 || objTarget.y != 0 || objTarget.z != 0){
        document.querySelector("#resetButton").classList = "";
    }
    else{
        document.querySelector("#resetButton").classList = "hide";
    }

    screenScript.writeOnCanvas(screenCtx,desktopCtrl);
    screenCanvas.needsUpdate = true;

    controls.update();
    renderer.render( scene, camera );

};

const pointLightHelper = new three.PointLightHelper(redLight,3);
const pointLightHelper2 = new three.PointLightHelper(blueLight,3);
// scene.add(pointLightHelper);
// scene.add(pointLightHelper2);




window.addEventListener("load",() => {
    for(let i of scene.children){
        if (i.name == "text"){
            textList.push(i);
        }
    }

    document.querySelector("#resetButton").addEventListener("click",()=>{
        objTarget = {x:0,y:0,z:0};
        desktopCtrl = false;
    });
    document.querySelector("#loading").style.display="none";
    animate();
    

    // setTimeout(() => {
    //     dirLight.intensity = .5;
    // },100);
});

window.addEventListener("resize",() => {
    renderer.setSize( window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


function onHover(e){
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse,camera);
    const intersects = raycaster.intersectObjects(clickable);
    if (intersects.length>0){
        document.body.style.cursor = "pointer";
    }else{
        document.body.style.cursor = "auto";
    }
}
function onclick(e){
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse,camera);
    const intersects = raycaster.intersectObjects(clickable);
    if (intersects.length>0){
        /**
         * if light clicked
         */
        if (intersects[0].object.parent.name == "lightSwitch"){
            if (dirLight.intensity > 0){
               dirLight.intensity = 0; 
               setTimeout(() => {
                    setTimeout(() => {
                        redLight.intensity = .25;
                        blueLight.intensity = .25;  
                        setTimeout(() => {
                            redLight.intensity = .05;
                            blueLight.intensity = .05;
                            setTimeout(() => {
                                redLight.intensity = .5;
                                blueLight.intensity = .5; 
                            },Math.floor(Math.random()*(150-50+1))+50);
                        },Math.floor(Math.random()*(150-50+1))+50);
                    },Math.floor(Math.random()*(150-50+1))+50);    
                },50)
            } else{
                dirLight.intensity = .5;
                redLight.intensity = 0;
                blueLight.intensity = 0;
            }
            
            
            // redLight.intensity = redLight.intensity > 0 ? 0 : .5;
            // blueLight.intensity = blueLight.intensity > 0 ? 0 : .5;
            for (let i of intersects[0].object.parent.children){
                if (i.name == "button"){
                    // if (i.rotation.x >= Math.PI/9){
                    //     i.rotation.x--;
                    // }else if (i.ratation.x <= -Math.PI/9){
                    //     i.rotation.x++
                    // }

                    i.rotation.x = i.rotation.x == Math.PI/9 ? -Math.PI/9 : Math.PI/9;
                }
            }
        }
        if(intersects[0].object.parent.name == "monitor"){
            let monitorPos = intersects[0].object.parent.position;
            desktopCtrl = true;
            objTarget = monitorPos;
        }
        if(intersects[0].object.parent.link){
            window.location.href = `https://${intersects[0].object.parent.link}`;
        }
    }
}

function changeCamTarget(toFocus){
    const speed = 2.5;
    if(Math.round(controls.target.x) !== Math.round(toFocus.x)){
        if (controls.target.x < toFocus.x){
            controls.target.x+=1;
        }else if(controls.target.x>toFocus.x){
            controls.target.x-=1;
        } 
    }
    if(Math.round(controls.target.y) !== Math.round(toFocus.y)){
        if (controls.target.y < toFocus.y){
            controls.target.y+=1;
        }else if(controls.target.y>toFocus.y){
            controls.target.y-=1;
        } 
    }
    if(Math.round(controls.target.z) !== Math.round(toFocus.z)){
        if (controls.target.z < toFocus.z){
            controls.target.z+=.5;
        }else if(controls.target.z>toFocus.z){
            controls.target.z-=.5;
        } 
    }
    
    if (toFocus.x!=0 || toFocus.y!=0 || toFocus.z!=0){
        if (Math.round(camera.position.x) < toFocus.x-1){
            camera.position.x += speed;
        }else if(Math.round(camera.position.x)>toFocus.x+1){
            camera.position.x -= speed;
        } 
        if (Math.round(camera.position.y) < toFocus.y-35){
            camera.position.y += speed;
        }else if(Math.round(camera.position.y) > toFocus.y-30){
            camera.position.y -= speed;
        }
        if (Math.round(camera.position.z) < toFocus.z-10){
            camera.position.z += speed;
        }else if(Math.round(camera.position.z)>toFocus.z+10){
            camera.position.z -= speed;
        }
        controls.mouseButtons = {
            LEFT:null,
            MIDDLE:null,
            RIGHT:null
        }
        controls.enableZoom = false;
        controls.touches = {
            ONE: null,
            TWO: null
        }
        
    }
    else{
        controls.mouseButtons = {
            LEFT:null,
            MIDDLE:three.MOUSE.ROTATE,
            RIGHT:three.MOUSE.ROTATE
        }
        controls.enableZoom = true;
        controls.touches = {
            ONE: three.TOUCH.ROTATE,
            TWO: three.TOUCH.DOLLY_PAN
        }
        if (Math.round(camera.position.y) > -90 && Math.round(camera.position.x) > -90){
            camera.position.y -= speed;
            camera.position.x -= speed
        }
        
    }
}
