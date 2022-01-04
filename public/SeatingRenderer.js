console.log("SeatingRenderer is a go");
//initialize PIXIJS 
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
var app = new PIXI.Application({
  forceCanvas: true,
  backgroundColor: 0xD5DFE5
});

//set size to 400 x 400 pixels
app.renderer.autoResize = true;
app.renderer.resize(300, 400);

//add it to the holding element
var display = document.getElementById("diagramHolder");
display.appendChild(app.view);

//function to create a Sprite representing a given seat
//returns a PIXI.Sprite that fits the provided parameters
function createSeat(x, y, gone=false){
    var seat = PIXI.Sprite.from(PIXI.Texture.WHITE);
    if (!gone){
        seat.interactive = true;
    }
    seat.on("click", function(){
        console.log("HI");
        seat.taken = !seat.taken;
        if (!seat.taken){
            seat.tint = 0x218380;
        }
        else{
            seat.tint = 0x05299E;
        }
    })
    seat.width = 25;
    seat.height = 25;
    if (!gone){
        seat.tint = 0x218380;
    }
    else{
        seat.tint = 0x061826;
    }
    seat.x = x;
    seat.y = y;
    seat.taken = false;
    seat.isSeat = true;
    return seat;
}

//function to create a Sprite representing a part of the building (layout)
//returns a PIXI.Sprite that fits the provided parameters
function createBuildingPiece(x, y, width, height){
    var piece = PIXI.Sprite.from(PIXI.Texture.WHITE);
    piece.isSeat = false;
    piece.width = width;
    piece.height = height;
    piece.tint = 0xBB9457;
    piece.x = x;
    piece.y = y;
    return piece;
}


//class for creating layout of seats and building pieces
//each Layout instance can be used to represent a room
//render- renders the given layout to the stage (must supply app.stage as a parameter)
//takeSeat- changes the value of taken for the seat at the provided index
class Layout{
    constructor(items){
        this.objects = items;
    }

    render(stage){
        for (var obj of this.objects){
            stage.addChild(obj);
        }
    }

    takeSeat(index){
        var s = this.objects[index]
        s.taken = !s.taken;
        if (!s.taken){
            s.tint = 0x218380;
        }
        else{
            s.tint = 0xD81159;
        }
    }
}

var theater = new Layout([
    createBuildingPiece(10, 10, 280, 20),
    createSeat(10, 50),
    createSeat(50, 50),
    createSeat(90, 50)
]);

var diningRoom1 = new Layout([
    createSeat(10, 50),
    createSeat(10, 90, true),
    createSeat(10, 130),
    createBuildingPiece(60, 20, 20, 180),
    createSeat(100, 50),
    createSeat(100, 90),
    createSeat(100, 130),
    createSeat(160, 200),
    createSeat(160, 240),
    createSeat(160, 280),
    createBuildingPiece(210, 170, 20, 180),
    createSeat(250, 200),
    createSeat(250, 240),
    createSeat(250, 280)
]);

var diningRoom2 =  new Layout([
    createSeat(10, 50),
    createSeat(10, 90),
    createSeat(10, 130),
    createBuildingPiece(60, 20, 20, 180),
    createSeat(100, 50),
    createSeat(100, 90),
    createSeat(100, 130),
]);

var vipRoom = new Layout([
    createSeat(10, 50),
    createSeat(50, 50),
    createSeat(90, 50),
    createSeat(10, 200),
    createSeat(50, 200),
    createSeat(90, 200)
])


class SeatingDiagram{
    constructor(){
        this.rooms =  new Map();
        this.rooms.set("Theater", theater);
        this.rooms.set("Dining Room 1", diningRoom1);
        this.rooms.set("Dining Room 2", diningRoom2);
        this.rooms.set("VIP Room", vipRoom);
    }

    render(name){
        //remove all existing pieces
        for (var i = app.stage.children.length - 1; i >= 0; i--){
            app.stage.removeChild(app.stage.children[i]);
        }
        //render the layout
        this.rooms.get(name).render(app.stage);
    }

    makeEditable(name){
        var room = this.rooms.get(name);
        for (var obj of room.objects){
            if (obj.isSeat){
                obj.taken = false;
                obj.tint = 0x218380;
            }
            obj.interactive = true;
            obj.on("mousedown", onDragStart);
            obj.on("mousemove", onDragMove);
            obj.on("mouseup", onDragEnd);
        }
    }

    addItem(room_name, data){
        console.log("Added");
        var room = this.rooms.get(room_name);
        if (data.isSeat){
            var newSeat = createSeat(0, 0);
            newSeat.interactive = true;
            newSeat.taken = false;
            newSeat.tint = 0x218380;
            newSeat.on("mousedown", onDragStart);
            newSeat.on("mousemove", onDragMove);
            newSeat.on("mouseup", onDragEnd);
            room.objects.push(newSeat);
        }
        else{
            var newPiece = createBuildingPiece(0, 0, data.width, data.height);
            newPiece.interactive = true;
            newPiece.on("mousedown", onDragStart);
            newPiece.on("mousemove", onDragMove);
            newPiece.on("mouseup", onDragEnd);
            room.objects.push(newPiece);
            room.objects.push();
        }
        this.render(room_name);
    }
}




function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;
    this.data = null;
    obj.tint = 0x218380;
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}
