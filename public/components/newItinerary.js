class Itinerary {
    constructor() { }
    
    table = [];
    el = document.getElementById('tasks');

    fetchAll() {
        fetch("/getReservations")
        .then(res => res.json())
        .then(dict => {
            console.log(dict);
            for(const [timestamp, reservations] of Object.entries(dict)) {
                console.log(timestamp);
                console.log(reservations);
                for (const [isseat, reservation] of Object.entries(reservations)) {
                    if(isseat == "true") {
                        console.log("IN HERE: " + isseat);
                        this.table.push({
                            reservation: reservation.tickets + " seats",
                            timestamp: timestamp,
                            isseat: isseat,
                            event: reservation.event
                        });
                    } else {
                        console.log("IN NOT HERE: " + isseat);
                        this.table.push({
                            reservation: reservation.tickets + " tickets for " + reservation.event,
                            timestamp: timestamp,
                            isseat: isseat,
                            event: reservation.event
                        });
                    }
                }
            }

            var data = '';
            var i = 1;
            for(var j = 0; j < this.table.length; ++j) {
                let reservation = this.table[j];
                let timestamp = reservation.timestamp;
                console.log(timestamp);
                var date = new Date(timestamp);
                console.log();
                let h = date.getHours();
                this.table[j].hour = h;
                let m = date.getMinutes();
                let append = "";
                if(h > 12) {
                    h-= 12;
                    append = " pm";
                } else {
                    append = " am";
                }
                if (h < 10){h = "0" + h;}
                if (m < 10){m = "0" + m;}
                var time = h + ":" + m + append;
                console.log("DATE: " + date.getYear());
                var readableMonth = date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
                var readableYear = date.getYear() > 100 ? date.getYear() - 100 : date.getFullYear();
                var readableDate = readableMonth + '/' + date.getDate() + '/' + readableYear;
                this.table[j].date = date.getFullYear() + '/' + readableMonth + '/' + date.getDate();
                data += '<tr>'; //adds table row
                data += '<td>' + i + '. ' + '</td>'; //adds table cell so it says the task number then the task info i.e 3. Eat lunch
                data += '<td>' + reservation.reservation + '</td>';
                data += '<td>' + time + '</td>';
                data += '<td>' + readableDate +'</td>';
                //console.log("The Task: " + this.combinedArray[i].theTask);
                //console.log("TheOg: " + this.combinedArray[i].theOg);
                data += '<td><button onclick = "itinerary.Delete(' + j + ')" class = "btn btn-danger btn-edit"> Delete </button></td>'; // adds edit button
                data += '</tr>';
                ++i;
            }

            this.Count(i-1);
            //console.log(this.tasks);

            //console.log("Aarnav Here are the dates");
            //console.log(this.dates);
            return this.el.innerHTML = data;
        });
    }
    
    Count(data) {
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

    Delete(j) {
        fetch('/deleteReservations', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: this.table[j].date,
                hour: this.table[j].hour,
                event: this.table[j].event,
                isseat: this.table[j].isseat,
            })
        })
        this.table.splice(j, 1);
        this.fetchAll();
    }
}