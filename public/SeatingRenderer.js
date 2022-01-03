//initialize PIXIJS 
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
var app = new PIXI.Application({
  forceCanvas: true,
  backgroundColor: 0xD5DFE5
});

//set size to 400 x 400 pixels
app.renderer.autoResize = true;
app.renderer.resize(400, 400);

//add it to the holding element
var display = document.getElementById("diagramHolder");
display.appendChild(app.view);

//function to create a Sprite representing a given seat
//returns a PIXI.Sprite that fits the provided parameters
function createSeat(x, y, taken){
    var seat = PIXI.Sprite.from(PIXI.Texture.WHITE);
    seat.width = 25;
    seat.height = 25;
    if (!taken){
        seat.tint = 0x218380;
    }
    else{
        seat.tint = 0xD81159;
    }
    seat.x = x;
    seat.y = y;
    seat.taken = taken;
    return seat;
}

//function to create a Sprite representing a part of the building (layout)
//returns a PIXI.Sprite that fits the provided parameters
function createBuildingPiece(x, y, width, height){
    var piece = PIXI.Sprite.from(PIXI.Texture.WHITE);
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
    createBuildingPiece(10, 10, 380, 20),
    createSeat(10, 50, false),
    createSeat(50, 50, false),
    createSeat(90, 50, false)
]);

theater.render(app.stage);
theater.takeSeat(1);
theater.takeSeat(1);
theater.takeSeat(2);
