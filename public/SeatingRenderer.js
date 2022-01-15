console.log("SeatingRenderer is a go");
//initialize PIXIJS 
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
var app = new PIXI.Application({
  forceCanvas: true,
  backgroundColor: 0xD5DFE5
});

var diagram;

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
    constructor(items=[]){
        this.objects = items;
        if (items.length > 0){
            this.roomid = this.objects[0].roomid;
        }
        this.deletedItems = [];
    }


    init(){
        this.roomid = this.objects[0].roomid;  
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

    getUpdateJSON(){
        var deletedItems = this.deletedItems;
        var filtered = [];
        for (var obj of this.objects){
            var failed = false;
            if (obj.new){
                for (item of deletedItems){
                    if (item.identifier == obj.identifier){
                        failed = true;
                        break;
                    }
                }
            }
            if (!failed){
                console.log("X", obj.x);
                console.log("Y", obj.y);
                filtered.push({
                    "pk":obj.pk,
                    "new": obj.new,
                    "isseat": obj.seat,
                    "x": Math.round(obj.x),
                    "y": Math.round(obj.y),
                    "width":obj.width,
                    "height":obj.height,
                    "available":obj.taken                   
                });
            }
        }
        return filtered;
    }

    getDeletionJSON(){
        var info = [];
        for (var obj of this.deletedItems){
            info.push({
                "pk": obj.pk                
            });
        }
        return info;
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

    makeLayout(roomData){
        var roomToBeMade = new Layout();
        let arr = [];
        for (var piece of roomData){
            console.log("PIECE", piece);
            if (piece.isseat){
                var s = createSeat(piece.x, piece.y, !piece.available);
                s.roomid = piece.roomid;
                s.new = false;
                s.pk = piece.pk;
                s.seat = true;
                s.parenter = roomToBeMade;
                arr.push(s);
            }
            else{
                var b = createBuildingPiece(piece.x, piece.y, piece.width, piece.height)
                b.roomid = piece.roomid;
                b.new = false;
                b.pk = piece.pk;
                b.seat = false;
                b.parenter = roomToBeMade;
                arr.push(b);
            }
        }
        roomToBeMade.objects = arr;
        roomToBeMade.init();
        return roomToBeMade;
    }

    constructor(rooms){
        this.rooms =  new Map();
        this.deleting = false;
        diagram = this;
        /*
        this.rooms.set("Theater", theater);
        this.rooms.set("Dining Room 1", diningRoom1);
        this.rooms.set("Dining Room 2", diningRoom2);
        this.rooms.set("VIP Room", vipRoom);
        */

        for (var room of rooms){
            let key = Object.keys(room)[0]
            this.rooms.set(key, this.makeLayout(room[key]));
        }
        //this.rooms.set("", new Layout([]));
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
            diagram = this;
            obj.on("mousedown", onDragStart);
            obj.on("mousemove", onDragMove);
            obj.on("mouseup", onDragEnd);
        }
    }

    addItem(room_name, data, x=0, y=0){
        console.log("Added");
        var room = this.rooms.get(room_name);
        if (data.isSeat){
            var newSeat = createSeat(x, y);
            newSeat.interactive = true;
            newSeat.taken = false;
            newSeat.tint = 0x218380;
            newSeat.on("mousedown", onDragStart/*function(){
                console.log("WATCH THIS:");
                onDragStart(event, x, newSeat);
            }*/);
            newSeat.on("mousemove", onDragMove);
            newSeat.on("mouseup", onDragEnd);
            newSeat.new = true;
            newSeat.seat = true;
            newSeat.deleting = this.deleting;
            newSeat.parenter = room;
            room.objects.push(newSeat);
        }
        else{
            var newPiece = createBuildingPiece(x, y, data.width, data.height);
            newPiece.interactive = true;
            newPiece.on("mousedown", onDragStart);
            newPiece.on("mousemove", onDragMove);
            newPiece.on("mouseup", onDragEnd);
            newPiece.new = true;
            newPiece.taken = false;
            newPiece.seat = false;
            newPiece.deleting = this.deleting;
            newPiece.parenter = room;
            room.objects.push(newPiece);
        }
        this.render(room_name);
    }


    //generate JSON about a given room for use by server
    generateJSON(name){
        return {
            "updates": this.rooms.get(name).getUpdateJSON(),
            "deletions": this.rooms.get(name).getDeletionJSON(),
            "roomid": this.rooms.get(name).roomid
        }
    }

    toggleDeleting(name){
        this.deleting = !this.deleting;
    }
}


function onDragStart(event/*event, diagram, item*/)
{

    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    if (diagram.deleting){
        console.log("BYE BYE");
        this.parenter.deletedItems.push({
            pk: this.pk,
            x: Math.round(this.position.x),
            y: Math.round(this.position.y),
            width: this.width,
            height: this.height,
            isseat: this.seat,
            available: this.taken
        });
        app.stage.removeChild(this);
        
    }
    else{
        console.log("HERE");
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
    }

}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;
    this.data = null;
    this.tint = 0x218380;
}

function onDragMove()
{
    console.log("HERELLLL")
    if (this.dragging)
    {
        console.log("HEREX");
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
    
}
