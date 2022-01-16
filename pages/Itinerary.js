var socket = io();
var username = "USER";

var app =  new function() {


    this.el = document.getElementById('tasks');
    this.tasks = [];
    this.times = [];
    this.dates = [];
    this.combinedArray = [];
    this.rawDates = [];

    

    //S();

    this.FetchAll = function () { // Takes all of our tasks and displays them
        this.combinedArray = [];
        for (i = 0; i < this.tasks.length; i++ ) {
            var taskTime = {
                theTask: this.tasks[i],
                theTime: this.times[i],
                theDate: this.dates[i],
                theOg: i
            }

            this.combinedArray.push(taskTime);
        }
        //console.log("dates: ");
        //console.log(this.dates);

        /*document.getElementById('edit-box').style.display = 'none';*/  /*<tr>
        <form action = "javascript:void(0);" method = "POST" id = "save-edit">
            <td ><input  type = "text" id = "edit-todo"></td><!-- style = "width: 30px;" -->
            <td><input type = "time" id = "edit-time" placeholder="time" ></td> <!-- size = "1" -->
            <td><input type = "date" id = "edit-date" ></td> <!-- size = "1" -->
           <td><input type = "submit" value = "save" class = "btn btn-success"></td> <td><a onclick = "CloseInput()" aria-label = "Close">&#10006;</a> </td>
        </form> */
        let data = '';

        if (this.times.length > 1 && this.dates.length > 1) {
            this.sortTime();
        }

        if (this.tasks.length > 0) {
            //console.log("ABOUT TO MAKE THE THING:");
            //console.log(this.tasks);
            for (i = 0; i < this.tasks.length; i++) {
                data += '<tr>'; //adds table row
                data += '<td>' + (i+1) + '. ' + '</td>'; //adds table cell so it says the task number then the task info i.e 3. Eat lunch
                data += '<td>' + this.combinedArray[i].theTask + '</td>';
                data += '<td>' + convertToTwelveHr(trimTime(this.combinedArray[i].theTime)) + '</td>';
                data += '<td>' + convertDate(this.combinedArray[i].theDate) +'</td>';
                //console.log("The Task: " + this.combinedArray[i].theTask);
                //console.log("TheOg: " + this.combinedArray[i].theOg);
                data += '<td> <button onclick = "app.Edit('+i+')" class = "btn btn-warning" > Edit </button>  <button onclick = "app.Delete('+this.combinedArray[i].theOg+')" class = "btn btn-danger btn-edit"> Delete </button></td>'; // adds edit button
                data += '</tr>';
            }
            //console.log("OUT:");
            //console.log(data);
        }

        this.Count(this.tasks.length);
        //console.log(this.tasks);

        //console.log("Aarnav Here are the dates");
        //console.log(this.dates);
        return this.el.innerHTML = data;

        
    };

    this.FetchEdit = function (rowNum) {
        var editAdded = false;
        let data = '';
        for (i = 0; i < this.tasks.length; i++) {
            data += '<tr>'; // adds table row
            data += '<td>' + (i+1) + '. ' + '</td>'; // adds table cell so it says the task number then the task info i.e 3. Eat lunch
            data += '<td>' + this.combinedArray[i].theTask + '</td>';
            data += '<td>' + convertToTwelveHr(trimTime(this.combinedArray[i].theTime)) + '</td>';
            data += '<td>' + convertDate(this.combinedArray[i].theDate) +'</td>';
            data += '<td> <button onclick = "app.Edit('+this.combinedArray[i].theOg+')" class = "btn btn-warning edit-button" > Edit </button>  <button onclick = "app.Delete('+i+')" class = "btn btn-danger btn-edit"> Delete </button></td>'; // adds edit button
            data += '</tr>';
            if (i === rowNum) {
                var betterV = this.tasks[i].replace("RESERVATION FOR: ", "").trim();
                //console.log("INFO FOR EDIT: " + username + " " + this.rawDates[i] + " " + this.dates[i] + " " + betterV);
                const currentOg = this.combinedArray[i].theOg;
                //console.log("PASSING THIS: " + currentOg);
                /* row data */
                rowData = ''
                rowData += '<tr class = "edit-row">';
                rowData += '<form action = "javascript:void(0);" method = "POST" id = "save-edit">';
                rowData += '<td ></td>';
                rowData += '<td > <input  type = "text" id = "edit-todo"></td>';
                rowData += '<td><input type = "time" id = "edit-time" placeholder="time" ></td>';
                rowData += '<td><input type = "date" id = "edit-date" ></td>';
                rowData += '<td><input type = "submit" value = "save" class = "btn btn-success" onclick = "app.saveEdit('+currentOg+');"> <a onclick = "CloseInput()" class = "close-button" aria-label = "Close">&#10006;</a> <button onclick = "CloseInput()" class = "btn btn-secondary"> Close </button> </td>';
                rowData += '</form>';
                rowData += '</tr>';
                /* row data */
                data += rowData;
                editAdded = true;
            }
            
        }
        if (!editAdded) {
            /* row data */
            rowData = ''
            rowData += '<tr class = "edit-row">';
            rowData += '<form action = "javascript:void(0);" method = "POST" id = "save-edit">';
            rowData += '<td ></td>';
            rowData += '<td > <input  type = "text" id = "edit-todo"></td>';
            rowData += '<td><input type = "time" id = "edit-time" placeholder="time" ></td>';
            rowData += '<td><input type = "date" id = "edit-date" ></td>';
            rowData += '<td><input type = "submit" value = "save" class = "btn btn-success" onclick = "app.saveEdit('+0+');"> <a class = "close-button" onclick = "CloseInput()" aria-label = "Close"> &#10006;</a> <button onclick = "CloseInput()"class = "btn btn-secondary"> Close </button> </td>';
            rowData += '</form>';
            rowData += '</tr>';
            /* row data */
            data += rowData;
        }

        //console.log(this.tasks);
    
    return this.el.innerHTML = data;
        
    };

    this.Add = function () { //adds a task
        var elTask = document.getElementById('add-todo');
        var elTime = document.getElementById('add-time');
        var elDate = document.getElementById('add-date');
        var task = elTask.value;
        var time = elTime.value;
        time += ":00";
        var date = elDate.value;

        if (task && time && elDate.value) {
            this.tasks.push(task.trim());
            this.times.push(time);
            var rawTime = new Date(date + "T" + time).getTime();
            this.rawDates.push(rawTime);
            var convertedDate = convertDate(date);
            this.dates.push(date);
            //console.log(this.times);
            
            socket.emit("CUSTOM STUFFFFF: " + task + " " + time + " " + username + " " + date);
            socket.emit("addTask", [task, time, username, date]);
       //     this.timesOfDays.push(timeOfDay);
            elTask.value = '';
            document.getElementById('add-time').value = '';
            //console.log(time);
            this.FetchAll();
        }
        //document.getElementById('output').innerHTML = convertedDate;
    };

    this.Edit = function(item) {  //edits task
        /*//console.log(item);
        //console.log(item);
        //console.log(this.tasks[item]);*/
        //console.log("this.tasks");
        //console.log("EDITING: " + item);
        
        var elTask = document.getElementById('edit-todo');
        var elTime = document.getElementById('edit-time');
        var elDate = document.getElementById('edit-date');

        this.FetchEdit(item);

      

  /*      elTask.value = this.tasks[item];
        elTime.value = this.times[item]; */

        //console.log("Fetch Edit");
        //document.getElementById('edit-box').style.display = 'block'; //defaults to close, displays it
    
        /*document.getElementById('save-edit').onsubmit = function() {
            //console.log('saved edit, kinda garbo tho');
            var task = elTask.value;
            var time = elTime.value;
            var date = elDate.value;
            if (task && time && checkTime(time)) {
                self.tasks.splice(item, 1, task.trim());
                self.times.splice(item, 1, time);
                var convertedDate = convertDate(date);
                self.dates.splice(item, 1, convertedDate);
                self.FetchAll();
                CloseInput();
            }
        }*/
    };
    
    this.saveEdit = function(item){ 
        //console.log("Saving this: " + item);
        self = this;

        var elTask = document.getElementById('edit-todo');
        var elTime = document.getElementById('edit-time');
        var elDate = document.getElementById('edit-date');
       
       

        //console.log('saved edit, kinda garbo tho');
        var task = elTask.value;
        var time = elTime.value;
        var date = elDate.value;
        //console.log("Aarnav look here");
        //console.log(date);
        var betterV = this.tasks[item].replace("RESERVATION FOR: ", "").trim();
        //console.log("INFO FOR REMOVAL: " + username + " " + self.rawDates[item] + " " + self.dates[item] + " " + betterV);
        /*socket.emit("deleteTask", [username, self.rawDates[item], self.dates[item], betterV]);
        socket.emit("addTask", [task, time, username, date]);*/
        //console.log("USERNAME: " + username);
        socket.emit("updateTask", [username, betterV, self.rawDates[item], self.dates[item], task, time, date])
        if (task && time && checkTime(time)) {
            self.tasks[item] = task;
            self.dates[item] = date;
            self.times[item] = time;
            var actualTime = new Date(date + "T" + time);
            const timestamp = actualTime.getTime();
            self.rawDates[item] = timestamp;
            //self.tasks.splice(item-1, 1, task.trim());
            //self.times.splice(item-1, 1, time);
 
            //self.dates.splice(item-1, 1, date);
            self.FetchAll();
            CloseInput();
        }
        //console.log("edit saved");
        //console.log(this.tasks);


    }

    this.Delete = function (item) { //deletes element
        //console.log("THE BIG Q: " + item);
        //console.log("BEFORE DELETE:");
        //console.log(this.tasks);
        //console.log(this.times);
        //console.log(this.dates);
        var betterV = this.tasks[item].replace("RESERVATION FOR: ", "").replace("Chickens R Us", "Chickens-R-Us").trim();
        //1611907200000
        //console.log(username + " " + this.rawDates[item] + " " + this.dates[item] + " " + betterV);
        socket.emit("deleteTask", [username, this.rawDates[item], this.dates[item], betterV]);
        this.tasks.splice(item, 1);
        this.times.splice(item, 1);
        this.dates.splice(item, 1);
        //console.log("AFTER DELETE: ");
        //console.log(this.tasks);
        //console.log(this.times);
        //console.log(this.dates);
        this.FetchAll();
        
    };

    this.Count = function(data) { //counts and displays elemetnts
        let el = document.getElementById('counter');
        let name = 'Tasks';
        let finalHTML = "You have ";

        if (data) {
            if (data == 1) {
                name = 'Task';
            }
            finalHTML += data + ' ' + name;
        }
        else {
            finalHTML += "No " + name;``
        }
        el.innerHTML = finalHTML;
    }



    this.sortTime = function () {

        

        this.combinedArray.sort(function(el1, el2) {

            var time1 = el1.theTime;
            var time2 = el2.theTime;

            if (time1.length === 4) {
            var x = time1[0] + time1[2] + time1[3];
            }
            else {
            var x = time1[0] + time1[1] + time1[3] + time1[4];
            }

            if (time2.length === 4) {
            var y = time2[0] + time2[2] + time2[3];
            }
            else {
            var y = time2[0] + time2[1] + time2[3] + time2[4];
            }

            e = parseInt(x, 10);
            f = parseInt(y, 10);

            if (e>f) {return 1;}
            if (f>e) {return -1;}
            return 0

        });

        this.combinedArray.sort(function(el1, el2) {

            date1 = convertDate(el1.theDate);
            date2 = convertDate(el2.theDate);

            //console.log("sortDates");
            //console.log(date1);
            //console.log(date2);
            
            

            date1Obj = {
                year: date1[6] + date1[7] + date1[8] + date1[9],
                month: date1[3]+ date1[4],
                day: date1[0] + date1[1]
            }

            date2Obj = {
                year: date2[6] + date2[7] + date2[8] + date2[9],
                month: date2[3]+ date2[4],
                day: date2[0] + date2[1]
            }

            var day1 = parseInt(date1Obj.day);
            var month1 = parseInt(date1Obj.month);
            var year1 = parseInt(date1Obj.year);
            var day2 = parseInt(date2Obj.day);
            var month2 = parseInt(date2Obj.month);
            var year2 = parseInt(date2Obj.year);

            if (year1 > year2) {return 1;}
            if (year2 > year1) {return -1;}
            if (month1 > month2) {return 1;}
            if (month2 > month1) {return -1;}
            if (day1 > day2) {return 1;}
            if (day2 > day1) {return -1;}

        });



    }
}

function convertDate(date) {
    var convertedDate =  date[5] + date[6] + date[7] +  date[8] + date[9] + date[4] + date[0] + date[1] + date[2] + date[3] ;
    return convertedDate;
}

function convertBack(date) {
    var convertedBackDate = date[6] + date[7] + date[8] + date[9] + date[5] + date[0] + date[1] + date[2] + date[3] + date[4];
    return convertedBackDate;
}

function trimTime(time) {
    var trimedTime = '';
    colonCount = 0;
    for (var i = 0; i < time.length; i++) {
        if (time.charAt(i) === ':') {colonCount++;}
        
        if (colonCount === 2) {
            break;
        }
        trimedTime += time[i];
    }
    return trimedTime;
}



app.FetchAll(); //fetches all by default

function CloseInput() { //closes edit box
    app.FetchAll();
}

function checkTime(time) {
    time.replace(/\s+/g, '');
    if (time.length  === 4) {
        time = "0" + time;
    }
    if (isDigit(time[0]) && isDigit(time[1]) && time[2] === ':' && isDigit(time[3]) && isDigit(time[4])
     && time.length === 5 ) {
        return true;
    }
    return false;
}

function convertToTwelveHr(time) {
    var isAM = false;
    var convertedTime;
    var first2Dig;
    if (time[1] === ':' || time[0] === '0') { //if one digit
        isAM = true;
    }
    else if(time[0] === '1' && (time[1] === "0" || time[1] === "1")) {
      isAM = true;
    }
    else {isAm = false; is2Dig = true;}

 
    if (isAM) {
      if (time[0] != '0') {
        convertedTime = time + " am";
        return convertedTime;
      }
      else {
        if (time[0] === '0' && time[1]==='0'){
          convertedTime = '12' + time.substr(2) + "am";
          return convertedTime;
        }
        convertedTime = time.substr(1) + "am";
        return convertedTime;
      }
    }

    else { // if pm
      first2Dig = time.substr(0,2);
      if (first2Dig!=12){
        first2Dig -= 12;
      }
      convertedTime = first2Dig + time.substr(2) + " pm";
    }
    return convertedTime;
}

function isDigit(charr) {
    if (charr === '0') {return true;}
    if (charr === '1') {return true;}
    if (charr === '2') {return true;}
    if (charr === '3') {return true;}
    if (charr === '4') {return true;}
    if (charr === '5') {return true;}
    if (charr === '6') {return true;}
    if (charr === '7') {return true;}
    if (charr === '8') {return true;}
    if (charr === '9') {return true;}
    return false;
}

window.onload = function(){


  var cookieData = document.cookie;
  username = cookieData.slice(cookieData.indexOf("name=") + 5, cookieData.length);

  var name = "";
    if (document.cookie.indexOf(";", document.cookie.indexOf("name=")) ==  -1){
        name = document.cookie.slice(document.cookie.indexOf("name=") + 5, document.cookie.length);
    }
    else{
        name = document.cookie.slice(document.cookie.indexOf("name=") + 5, document.cookie.indexOf(";", document.cookie.indexOf("name=") + 5));
    }

    username = name;


  //change this to user id or whatever else is used to identify users
  socket.emit("getTaskData", username);

  //test new cookie stuff
  socket.emit("getCookies", 0);

}

  socket.on("getTaskData", function(msg){

    //app.times = [];
    //app.dates = [];
    //console.log(msg);
  if (msg != null && msg != "fail"){
    for (task of msg){
        var attraction = task.attractionRideName;
        //console.log("RAW: " + task.numPeople);
        /*if (task.numPeople != 0 && task.numPeople != undefined){
            attraction = "RESERVATION FOR: " + attraction.replace(/-/g, " ").trim();
        }
        else{
            attraction = attraction.replace(/-/g, " ").trim();
        }*/
      
        app.rawDates.push(task.time);
        app.tasks.push(attraction);
        var date = new Date(task.time);
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        if (h < 10){h = "0" + h;}
        if (m < 10){m = "0" + m;}
        if (s < 10){s = "0" + s;}
        var time = h + ":" + m + ":" + s;
        //console.log("TIME: " + time);
        //console.log("ACTUAL TIME: " + date.toTimeString());
        //app.times.push(trimTime(time));
        app.times.push(time);

        //console.log("datesdwre");
        //console.log(convertDate(task.date));
        //app.dates.push(convertDate(task.date));
        app.dates.push(task.date);
        
    }
  }
  

  app.FetchAll();

});  