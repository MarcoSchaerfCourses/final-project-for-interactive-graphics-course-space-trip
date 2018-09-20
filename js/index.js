var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var sun;
var ground;
//var orbitControl;
var rollingGroundSphere;
var torso;
var rollingSpeed=0.0001;
var heroRollingSpeed;
var worldRadius=100;
var heroRadius=0.2;
var sphericalHelper;
var pathAngleValues;
var heroBaseY=77;
var bounceValue=0.1;
var gravity=0.005;
var leftLane=-1;
var rightLane=1;
var middleLane=0;
var currentLane;
var clock;
var jumping;
var RockReleaseInterval=0.1;
var lastRockReleaseTime=0;
var RocksInPath;
var RocksPool;
var particleGeometry;
var fireGeometry;
var fire;
var particleCount=20;
var explosionPower =1.06;
var particles;
//var stats;
var heatlhText;
var healthBar;
var lifeBar=100;
var score;
var count=0;
var startText;
var infoText;
var button1;
var button2;
var button3;
var wait=0;
var hasCollided;
var flame=0;
var boostON=false;
var fuel=100;
var textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin ( 'anonymous' );

var textureWorld = textureLoader.load( 'image/ground.jpg');
var textureNWorld = textureLoader.load( 'image/normalGround.jpg');
var textureSWorld = textureLoader.load( 'image/specGround.jpg');
var textureRock = textureLoader.load( 'image/moon.jpg');
var textureWhite = textureLoader.load( 'image/whiteMetal.jpg');
var textureRed = textureLoader.load( 'image/redMetal.jpg');
var textureGlass = textureLoader.load( 'image/glass.jpg');

var MatBody= new THREE.MeshStandardMaterial({map: textureWhite});
var MatPainted= new THREE.MeshStandardMaterial({map: textureRed});
var MatMetal= new THREE.MeshStandardMaterial({color: 0x333333});
var MatGlass= new THREE.MeshStandardMaterial({map: textureGlass});

var spaceShipModel;
var stillAlive = true;
var start=false;
var done=false;
var set1=false;
var set2=false;
var set3=false;
var ready=false;
var parts = [];
var diff=5;
init();



function init() {
    // set up the scene
    createScene();
    //call game loop
    update();
}



function createScene(){
    var prova;
    hasCollided=false;
    score=0;
    RocksInPath=[];
    RocksPool=[];
    clock=new THREE.Clock();
    clock.start();
    sphericalHelper = new THREE.Spherical();
    pathAngleValues=[1.52,1.57,1.62];
    sceneWidth=window.innerWidth;
    sceneHeight=window.innerHeight;
    scene = new THREE.Scene();//the 3d scene
    scene.fog = new THREE.FogExp2( 0x877A96, 0.01);
    camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000 );//perspective camera
    renderer = new THREE.WebGLRenderer({alpha:true});//renderer with transparent backdrop
    renderer.setClearColor(0x000000, 1);
    renderer.shadowMap.enabled = true;//enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize( sceneWidth, sceneHeight );
    dom = document.getElementById('TutContainer');
    dom.appendChild(renderer.domElement);
    //stats = new Stats();
    //dom.appendChild(stats.dom);
    addStars();
    createRocksPool();
    addWorld();
    AddSpaceShip();
    addLight();
    addExplosion();



    addHUD();
    camera.position.z = 10.5;
    camera.position.y = 80	;

    camera.lookAt(new THREE.Vector3(0,80,0));
    window.addEventListener('resize', onWindowResize, false);//resize callback

    document.getElementById("ButtonE").addEventListener('click', setDiff1);
    document.getElementById("ButtonN").addEventListener('click', setDiff2);
    document.getElementById("ButtonH").addEventListener('click', setDiff3);

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

}

function addHUD(){

    button1 = document.createElement('button');
    button1.style.position = 'absolute';
    button1.style.width = 100;
    button1.style.height = 100;
    button1.style.fontSize="20px";
    button1.style.fontWeight="bold";
    button1.innerHTML = "Easy"; // <br><br> <button id = ButtonN>Normal</button> <br><br> <button id = ButtonH>Hard</button>";
    button1.id="ButtonE";
    button1.style.textAlign = "center";
    button1.style.bottom="55%";
    button1.style.left = '50%';
    button1.style.color = "black";
    document.body.appendChild(button1);

    button2 = document.createElement('button');
    button2.style.position = 'absolute';
    button2.style.width = 100;
    button2.style.height = 100;
    button2.style.fontSize="20px";
    button2.style.fontWeight="bold";
    button2.innerHTML = "Normal";
    button2.id="ButtonN";
    button2.style.textAlign = "center";
    button2.style.bottom="50%";
    button2.style.left = '50%';
    button2.style.color = "black";
    document.body.appendChild(button2);

    button3 = document.createElement('button');
    button3.style.position = 'absolute';
    button3.style.width = 100;
    button3.style.height = 100;
    button3.style.fontSize="20px";
    button3.style.fontWeight="bold";
    button3.innerHTML = "Hard";
    button3.id="ButtonH";
    button3.style.textAlign = "center";
    button3.style.bottom="45%";
    button3.style.left = '50%';
    button3.style.color = "black";
    document.body.appendChild(button3);



    healthText = document.createElement('div');
    healthText.style.position = 'absolute';
    healthText.style.width = 100;
    healthText.style.height = 100;
    healthText.innerHTML = "Score";
    healthText.id="ButtonX";
    healthText.style.bottom = 80 + 'px';
    healthText.style.left = '5%';
    healthText.style.color = "yellow";
    document.body.appendChild(healthText);


    fuelText = document.createElement('div');
    fuelText.style.position = 'absolute';
    fuelText.style.width = 100;
    fuelText.style.height = 100;
    fuelText.innerHTML = "Fuel: ";
    fuelText.style.bottom = 50 + 'px';
    fuelText.style.left = '5%';
    fuelText.style.color = "yellow";
    document.body.appendChild(fuelText);


    scoreText = document.createElement('div');
    scoreText.style.position = 'absolute';
    scoreText.style.width = 10;
    scoreText.style.height = 10;
    scoreText.innerHTML = "0";
    scoreText.style.bottom = '30px';
    scoreText.style.left = '5%';
    scoreText.style.color = "yellow";
    document.body.appendChild(scoreText);

    fuelBar = document.createElement('div');
    fuelBar.style.position = 'absolute';
    fuelBar.style.width = lifeBar + 'px';
    fuelBar.style.height = '20px';
    fuelBar.innerHTML = lifeBar+'%';
    fuelBar.style.textAlign = "center";
    fuelBar.style.fontWeight='bold';
    fuelBar.style.bottom = 50 + 'px';
    fuelBar.style.left = '120px';
    fuelBar.style.backgroundColor = "red";
    fuelBar.style.color = "white";
    document.body.appendChild(fuelBar);

    healthBar = document.createElement('div');
    healthBar.style.position = 'absolute';
    healthBar.style.width = lifeBar + 'px';
    healthBar.style.height = '20px';
    healthBar.innerHTML = lifeBar+'%';
    healthBar.style.textAlign = "center";
    healthBar.style.fontWeight='bold';
    healthBar.style.bottom = 80 + 'px';
    healthBar.style.left = '120px';
    healthBar.style.backgroundColor = "green";
    healthBar.style.color = "white";
    document.body.appendChild(healthBar);

    infoText = document.createElement('div');
    infoText.style.position = 'absolute';
    infoText.style.width ="400px";
    infoText.style.height = "100px";
    infoText.style.color = "yellow";
    infoText.style.fontSize="50px";
    infoText.style.fontStyle="italic";
    infoText.style.fontFamily="Impact";
    infoText.style.textDecoration="line-through";
    infoText.innerHTML = "&nbsp&nbsp&nbsp&nbsp  SPACE TRIP   &nbsp&nbsp&nbsp&nbsp";
    infoText.style.top = 10 + 'px';
    infoText.style.left = '37%';
    document.body.appendChild(infoText);

    startText = document.createElement('div');
    startText.style.position = 'absolute';
    startText.style.width ="100%";
    startText.style.height = "10px";
    startText.style.color = "white";
    startText.style.fontSize="20px";
    startText.innerText = "Select the difficulty to start - use directional arrows to move and SPACEBAR for boosting";
    startText.style.top = "20%";
    startText.style.left = '20%';
    document.body.appendChild(startText);

}



function setDiff1(){
    diff=10;
    start=true;

}
function setDiff2(){
    diff=5;
    start=true;
}

function setDiff3(){
    diff=1;
    start=true;
}


function addLight(){
    var hemisphereLight = new THREE.HemisphereLight(0xfffafa,0x000000, .9)
    scene.add(hemisphereLight);
    sun = new THREE.DirectionalLight( 0xcdc1c5, 0.9);
    sun.position.set( 12,6,-7 );
    sun.castShadow = true;
    scene.add(sun);
    //Set up shadow properties for the sun light
    sun.shadow.mapSize.width = 256;
    sun.shadow.mapSize.height = 256;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 50 ;
}


//-------------------CONTROLS---------------------//

function handleKeyDown(keyEvent){
    if(jumping)return;
    var validMove=true;
    if ( keyEvent.keyCode === 37) {//left
        if (spaceShipModel.position.x>-7){
            spaceShipModel.position.x-=0.2;
            spaceShipModel.rotation.z =THREE.Math.degToRad(-40);
            spaceShipModel.rotation.x=THREE.Math.degToRad(-110);
    }
        if(currentLane==middleLane){
            currentLane=leftLane;
        }else if(currentLane==rightLane){
            currentLane=middleLane;
        }else{
            validMove=false;
        }
    } else if ( keyEvent.keyCode === 39) {//right
        if (spaceShipModel.position.x<7){
            spaceShipModel.position.x+=0.2;
            spaceShipModel.rotation.z = THREE.Math.degToRad(40);;
            spaceShipModel.rotation.x=THREE.Math.degToRad(-70);
        }
        if(currentLane==middleLane){
            currentLane=rightLane;
        }else if(currentLane==leftLane){
            currentLane=middleLane;
        }else{
            validMove=false;
        }
    }else{
        if ( keyEvent.keyCode === 38){//up, jump
            if (spaceShipModel.position.y<82){
                spaceShipModel.rotation.x = THREE.Math.degToRad(-75);
                spaceShipModel.position.y+=0.2;
            }
        }
        else if ( keyEvent.keyCode === 40){//down
            if (spaceShipModel.position.y>76.8){
                spaceShipModel.rotation.x = 54.5;
                spaceShipModel.position.y-=0.2
            }
        }
        else if ( keyEvent.keyCode == 32) { //space
            if(fuel>0) boostON=true;
        }
        else if ( keyEvent.keyCode == 13) { //enter
            start=true;
        }
        validMove=false;
    }

}


function handleKeyUp(keyEvent){
    if ( keyEvent.keyCode === 38){//up, jump
        spaceShipModel.rotation.x = THREE.Math.degToRad(-90);
    }
    else if ( keyEvent.keyCode === 40){//down
        spaceShipModel.rotation.x = THREE.Math.degToRad(-90);
    }
    else if ( keyEvent.keyCode === 37){//left
        spaceShipModel.rotation.z =0;
        spaceShipModel.rotation.x = THREE.Math.degToRad(-90);
    }
    else if ( keyEvent.keyCode === 39){//right
        spaceShipModel.rotation.z = 0;
        spaceShipModel.rotation.x = THREE.Math.degToRad(-90);
    }
    else if ( keyEvent.keyCode == 32) { //space
        boostON=false;
    }
}


//-----------------SPACESHIP CONSTRUCTOR----------------------//

function AddWing(){
    var wing = new THREE.Group(),
        parts = [];

    parts['theWing'] = new THREE.BoxGeometry( 10, 8, 1 );
    parts['theWing'].vertices[4].y -= 7;
    parts['theWing'].vertices[5].y -= 7;
    parts['theWing'].vertices[6].y -= 5;
    parts['theWing'].vertices[7].y -= 5;
    parts['theWing'].needsUpdate = true;

    parts['theWingMesh'] = new THREE.Mesh( parts['theWing'], MatBody );
    parts['theWingMesh'].position.y = -31;
    parts['theWingMesh'].position.x = -15.5;
    wing.add(parts['theWingMesh']);

    parts['theWingBottom'] = new THREE.BoxGeometry( 2, 9, 2 );
    parts['theWingBottom'].vertices[4].y -= 1;
    parts['theWingBottom'].vertices[5].y -= 1;
    parts['theWingBottom'].vertices[4].x -= .5;
    parts['theWingBottom'].vertices[5].x -= .5;

    parts['theWingBottom'].vertices[6].y -= 1;
    parts['theWingBottom'].vertices[7].y -= 1;
    parts['theWingBottom'].vertices[6].x += .5;
    parts['theWingBottom'].vertices[7].x += .5;
    parts['theWingBottom'].needsUpdate = true;

    parts['theWingBottomMesh'] = new THREE.Mesh( parts['theWingBottom'], MatPainted);
    parts['theWingBottomMesh'].position.y = -31;
    parts['theWingBottomMesh'].position.x = -10.5;
    wing.add(parts['theWingBottomMesh']);

    return wing;
}

function AddSpaceShip(){
    spaceShipModel = new THREE.Object3D();



    parts['top1'] = new THREE.Mesh( new THREE.CylinderGeometry( 0, 6, 4, 32 ), MatPainted );
    spaceShipModel.add(parts['top1']);

    parts['top2'] = new THREE.Mesh( new THREE.CylinderGeometry( 6, 10, 10, 32 ), MatPainted );
    parts['top2'].position.y = -7;
    spaceShipModel.add(parts['top2']);

    parts['top3'] = new THREE.Mesh( new THREE.CylinderGeometry( 10, 11, 8, 32 ), MatPainted );
    parts['top3'].position.y = -16;
    spaceShipModel.add(parts['top3']);

    parts['body'] = new THREE.Mesh( new THREE.CylinderGeometry( 10, 11, 20, 32 ), MatBody );
    parts['body'].position.y = -30;

    parts['wing1'] = AddWing();
    parts['wing2'] = AddWing();
    parts['wing3'] = AddWing();

    parts['wing1'].position.y=30;
    parts['wing2'].position.y=30;
    parts['wing3'].position.y=30;
    parts['body'].add(parts['wing1']);
    parts['body'].add(parts['wing2']);
    parts['wing2'].rotation.y = (Math.PI / 180) * 120;
    parts['body'].add(parts['wing3']);
    parts['wing3'].rotation.y = (Math.PI / 180) * -120;

    spaceShipModel.add(parts['body']);

    parts['bottom'] = new THREE.Mesh( new THREE.CylinderGeometry( 10, 8, 4, 6 ), MatMetal );
    parts['bottom'].position.y = -41;
    spaceShipModel.add(parts['bottom']);


    parts['fire'] = addFire();
    parts['fire'].position.y=-50;
    parts['fire'].position.x=-5;
    parts['fire'].position.z=-6;
    spaceShipModel.add(parts['fire']);

    parts['windowframe1'] = new THREE.Mesh( new THREE.CylinderGeometry( 5, 5, .5, 8 ), MatMetal );
    parts['windowframe1'].position.y = -15;
    parts['windowframe1'].position.z = 0;
    parts['windowframe1'].position.x = 10.6;
    parts['windowframe1'].rotation.z = (Math.PI / 2) - (Math.PI / 360 * -5);
    spaceShipModel.add(parts['windowframe1']);

    parts['windowglass1'] = new THREE.Mesh( new THREE.CylinderGeometry( 4, 4, .5, 8 ), MatGlass );
    parts['windowglass1'].position.y = -15;
    parts['windowglass1'].position.z = 0;
    parts['windowglass1'].position.x = 10.7;
    parts['windowglass1'].rotation.z = (Math.PI / 2) - (Math.PI / 360 * -5);
    spaceShipModel.add(parts['windowglass1']);

    parts['windowframe2'] = new THREE.Mesh( new THREE.CylinderGeometry( 5, 5, .5, 8 ), MatMetal );
    parts['windowframe2'].position.y = -15;
    parts['windowframe2'].position.z = -9.2;
    parts['windowframe2'].position.x = -5.5;
    parts['windowframe2'].rotation.x = (Math.PI / 2) + (Math.PI / 360 * +1);
    parts['windowframe2'].rotation.z = (Math.PI / 360 * -60);
    spaceShipModel.add(parts['windowframe2']);

    parts['windowglass2'] = new THREE.Mesh( new THREE.CylinderGeometry( 4, 4, .5, 8 ), MatGlass );
    parts['windowglass2'].position.y = -15;
    parts['windowglass2'].position.z = -9.3;
    parts['windowglass2'].position.x = -5.5;
    parts['windowglass2'].rotation.x = (Math.PI / 2) + (Math.PI / 360 * +1);
    parts['windowglass2'].rotation.z = (Math.PI / 360 * -60);
    spaceShipModel.add(parts['windowglass2']);




    spaceShipModel.scale.set(0.05,0.05,0.05);
    /* spaceShipModel.rotation.x = 55;
     spaceShipModel.rotation.y = 10;*/

    // to see the spaceship from side
    /*spaceShipModel.rotation.x = 0;
    spaceShipModel.rotation.z = 0;*/
    spaceShipModel.rotation.y = THREE.Math.degToRad(210);

    spaceShipModel.position.y = 81.5;
    spaceShipModel.position.x =-2;

    scene.add(spaceShipModel);
}





//------------------WORLD-------------------------------------------//

function addWorld(){
    var sides=60;
    var tiers=60;

    var sphereGeometry = new THREE.SphereGeometry( worldRadius, sides,tiers);
    var sphereMaterial = new THREE.MeshStandardMaterial( {shading:THREE.FlatShading, map: textureWorld, specMap: textureSWorld} )

    rollingGroundSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    rollingGroundSphere.receiveShadow = true;
    rollingGroundSphere.castShadow=false;
    rollingGroundSphere.rotation.z=-Math.PI/2;
    scene.add( rollingGroundSphere );
    rollingGroundSphere.position.y=-24;
    rollingGroundSphere.position.z=2;
    addWorldRocks();
}

function addStars() {
    var geometry = new THREE.Geometry();
    for (var i = 0; i < 10000; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = THREE.Math.randFloatSpread(2000);
        vertex.y = THREE.Math.randFloatSpread(2000);
        vertex.z = THREE.Math.randFloatSpread(2000);
        geometry.vertices.push(vertex);
    }
    var particles = new THREE.Points(geometry, new THREE.PointsMaterial({
        color: 0x888888
    }));
    scene.add(particles);
}



//-------------ROCKS---------------------------------//
function createRocksPool(){
    var maxRocksInPool=10;
    var newRock;
    for(var i=0; i<maxRocksInPool;i++){
        newRock=createRock();
        RocksPool.push(newRock);
    }
}

function addPathRock(){
    var options=[0,1,2];
    var lane= Math.floor(Math.random()*3);
    addRock(true,lane);
    options.splice(lane,1);
    if(Math.random()>0.5){
        lane= Math.floor(Math.random()*2);
        addRock(true,options[lane]);
    }
}
function addWorldRocks(){
    var numRocks=72;
    var gap=6.28/72;
    for(var i=0;i<numRocks;i++){
        addRock(false,i*gap, true);
        addRock(false,i*gap, false);
    }
}
function addRock(inPath, row, isLeft){
    var newRock;
    var altitude=101+(Math.random() * 6) + 1;
    if(inPath){
        if(RocksPool.length==0)return;
        newRock=RocksPool.pop();
        newRock.visible=true;
        RocksInPath.push(newRock);
        sphericalHelper.set( altitude, pathAngleValues[row], -rollingGroundSphere.rotation.x+4 );
    }else{
        newRock=createRock();
        var forestAreaAngle=0;//[1.52,1.57,1.62];
        if(isLeft){
            forestAreaAngle=1.68+Math.random()*0.1;
        }else{
            forestAreaAngle=1.46-Math.random()*0.1;
        }
        sphericalHelper.set( altitude, forestAreaAngle, row );
    }
    newRock.position.setFromSpherical( sphericalHelper );
    var rollingGroundVector=rollingGroundSphere.position.clone().normalize();
    var RockVector=newRock.position.clone().normalize();
    newRock.quaternion.setFromUnitVectors(RockVector,rollingGroundVector);
    newRock.rotation.x+=(Math.random()*(2*Math.PI/10))+-Math.PI/10;

    rollingGroundSphere.add(newRock);
}
function createRock(){
    var RockGeometry = new THREE.IcosahedronGeometry(Math.random()*2+1, 1);
    var RockMaterial = new THREE.MeshStandardMaterial( {color: 0xD05F2F, map: textureWorld, roughness: 2} );

    var RockTop = new THREE.Mesh( RockGeometry, RockMaterial );
    RockTop.castShadow=true;
    RockTop.receiveShadow=false;
    RockTop.position.y=0;
    RockTop.rotation.y=(Math.random()*(Math.PI));
    RockTop.rotation.x=(Math.random()*(Math.PI));
    RockTop.rotation.z=(Math.random()*(Math.PI));
    var Rock =new THREE.Object3D();
    Rock.add(RockTop);
    return Rock;
}

function doRockLogic(){
    var loss=20;
    if (boostON) loss=10;
    var oneRock;
    var RockPos = new THREE.Vector3();
    var RocksToRemove=[];
    var shipPos =new THREE.Vector3();
    RocksInPath.forEach( function ( element, index ) {
        oneRock=RocksInPath[ index ];
        RockPos.setFromMatrixPosition( oneRock.matrixWorld );
        if(RockPos.z>10 &&oneRock.visible){//gone out of our view zone
            RocksToRemove.push(oneRock);
        }else{
            oneRock.rotation.x+=0.05;
            if(RockPos.distanceTo(spaceShipModel.position)<=2){//check collision
                rollingSpeed=0.002;
                lifeBar-=loss;
                if (lifeBar<1) {
                    lifeBar=0;
                    gameOver();
                }
                healthBar.style.width = lifeBar + 'px';
                healthBar.innerHTML = lifeBar+'%';
                hasCollided=true;
                explode();
                fromWhere=RocksInPath.indexOf(oneRock);
                RocksInPath.splice(fromWhere,1);
                oneRock.visible=false;
            }
        }
    });
    var fromWhere;
    RocksToRemove.forEach( function ( element, index ) {
        oneRock=RocksToRemove[ index ];
        fromWhere=RocksInPath.indexOf(oneRock);
        RocksInPath.splice(fromWhere,1);
        RocksPool.push(oneRock);
        oneRock.visible=false;
    });
}

//----------------UPDATE----------------------//
function update(){
    var points=0.02;


    if (start && !ready) positioning();
    if (boostON) {
        rollingSpeed = 0.020;
        points = 0.04;}
    if (stillAlive && start && ready) {
        rollingGroundSphere.rotation.x += rollingSpeed;
        count+=points;
        score=Math.floor(count);
    }
    if (rollingSpeed<0.010){
        rollingSpeed+=0.0001;
    }  else if(!boostON) rollingSpeed=0.010;


    scoreText.innerHTML="Score : " + score.toString();
    if(clock.getElapsedTime()>RockReleaseInterval*diff) {
        clock.start();
        addPathRock();
    }
    parts['body'].rotation.y -= 0.01;
    boostLogic();
    doRockLogic();
    doExplosionLogic();
    doFireLogic();
    engine();
    render();
    requestAnimationFrame(update);//request next update
}

function boostLogic(){

    if (boostON && fuel>0) fuel-=1;
    if (!boostON && fuel<100 && stillAlive) fuel+=0.05;
    if (fuel<1) boostON=false;
    var fuelLab=Math.floor(fuel);
    if (fuelLab<0) fuelLab=0;
    fuelBar.style.width = fuel + 'px';
    fuelBar.innerHTML = fuelLab+'%';

}

function positioning(){
    startText.style.left="48%"
    startText.style.fontSize="50px";
    if (spaceShipModel.rotation.x>THREE.Math.degToRad(-90)){
        spaceShipModel.rotation.x-=0.01;
        if (spaceShipModel.rotation.x<THREE.Math.degToRad(-45)){
            startText.innerText = "2";
        } else startText.innerText = "3";
    } else set1=true;
    if (set1){
        startText.innerText = "1";
        setTimeout(setReady, 700);
    }

}

function setReady() {
    if(!ready) {
        flame.visible = true;
        ready = true;
        document.body.removeChild(startText);
        document.body.removeChild(infoText);
        document.body.removeChild(button1);
        document.body.removeChild(button2);
        document.body.removeChild(button3);
    }
}

//----------------FIRE--------------------//

function addFire(){
    fireGeometry = new THREE.Geometry();
    for (var i = 0; i < 100; i ++ ) {
        var vertex = new THREE.Vector3();
        fireGeometry.vertices.push( vertex );
    }

    var sprite1 = textureLoader.load( 'image/flame.jpg');
    var pMaterial = new THREE.PointsMaterial({
        color: 0xFC5D08,
        size: 3,
        map: sprite1,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    flame = new THREE.Points( fireGeometry, pMaterial );
    flame.visible=false;

    return flame;
}

function doFireLogic(){
    for (var i = 0; i < 100; i ++ ) {
        fireGeometry.vertices[i].multiplyScalar(explosionPower);
    }

    fireGeometry.verticesNeedUpdate = true;
}
function engine(){
    var mult=10;
    if (boostON) mult=13;
    for (var i = 0; i < 100; i ++ ) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * mult;
        vertex.y = Math.random() * mult;
        vertex.z = Math.random() * mult;
        fireGeometry.vertices[i]=vertex;
    }
    explosionPower=1.07;
}


//------------------------EXPLOSIONS-----------------//

function addExplosion(){
    particleGeometry = new THREE.Geometry();
    for (var i = 0; i < particleCount; i ++ ) {
        var vertex = new THREE.Vector3();
        particleGeometry.vertices.push( vertex );
    }

    var sprite1 = textureLoader.load( 'image/spikey.png');
    // var RockGeometry = new THREE.IcosahedronGeometry(Math.random()*2+1, 0);
    //var RockMaterial = new THREE.MeshStandardMaterial( {color: 0xE5E7E9, roughness: 1, shading:THREE.FlatShading} );
    var pMaterial = new THREE.PointsMaterial({
        color: 0xD05F2F,
        size: 0.8,
        map: sprite1,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    particles = new THREE.Points( particleGeometry, pMaterial );
    scene.add( particles );
    particles.visible=false;
}

function doExplosionLogic(){
    if(!particles.visible)return;
    for (var i = 0; i < particleCount; i ++ ) {
        particleGeometry.vertices[i].multiplyScalar(explosionPower);
    }
    if(explosionPower>1.005){
        explosionPower-=0.001;
    }else{
        particles.visible=false;
    }
    particleGeometry.verticesNeedUpdate = true;
}
function explode(){
    particles.position.y=spaceShipModel.position.y;
    particles.position.z=spaceShipModel.position.z+1;
    particles.position.x=spaceShipModel.position.x;
    for (var i = 0; i < particleCount; i ++ ) {
        var vertex = new THREE.Vector3();
        vertex.x = -0.2+Math.random() * 0.4;
        vertex.y = -0.2+Math.random() * 0.4 ;
        vertex.z = -0.2+Math.random() * 0.4;
        particleGeometry.vertices[i]=vertex;
    }
    explosionPower=1.07;
    particles.visible=true;
}
function render(){

    renderer.render(scene, camera);//draw
}
function gameOver () {
    scene.remove(spaceShipModel);
    var GOText = document.createElement('div');
    GOText.style.position = 'absolute';
    GOText.style.width ="100%";
    GOText.style.height = "100px";
    GOText.style.color = "red";
    GOText.style.backgroundColor = "black";
    GOText.style.fontSize="100px"
    GOText.innerHTML = "YOU DIED";
    GOText.style.textAlign = "center";
    GOText.style.top = '40%';
    //GOText.style.left = '30%';
    document.body.appendChild(GOText);
    stillAlive=false;
    //cancelAnimationFrame( globalRenderID );
    //window.clearInterval( powerupSpawnIntervalID );
}
function onWindowResize() {
    //resize & align
    sceneHeight = window.innerHeight;
    sceneWidth = window.innerWidth;
    renderer.setSize(sceneWidth, sceneHeight);
    camera.aspect = sceneWidth/sceneHeight;
    camera.updateProjectionMatrix();
}