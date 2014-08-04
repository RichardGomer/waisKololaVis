
function KSlide_connections(all, duration, facts)
{
    var self = this;
    self.all = all;
    self.people = all.people;
    self.events = all.events;
    self.endpoint_url = "http://www.wsdtc.deimpact.org.uk/api/1/";
    self.facts = facts;
    self.duration = duration;

    self.render = function(el, cb_done)
    {                
        //create a details panel
        $detail = $('<div class="detail"></div>');
        $("#" + el.id).append($detail);
        
        var colourMappings = ["#2c5ba1", "#739000", "#ff8c0f"];                       
        
        //go through each person and give each an array of people to number of times worked with
        var people = self.people;
        var data = [];
        var mappings = [];
        var names = [];
        var colours = [];
        for (var i = 0; i < people.length; i++) {
            var person = people[i];
            data[i] = [];
            mappings[person.personid] = i;
            names[i] = person.name;
            colours[i] = colourMappings[i % colourMappings.length];   
            for (var j = 0; j < people.length; j++) {
                data[i][j] = 0;
            }
        }
        
        //now go through all events (also count total number of people at events)
        var totalPeople = 0;
        var events = self.events;
        for (var i = 0; i < events.length; i++) {
            //for each event go through each person
            var eventPeople = events[i].people;
            totalPeople = totalPeople + eventPeople.length;
            
            //sort the list of people at the event
            var sortedList = [];
            for (var j = 0; j < eventPeople.length; j++){
                sortedList[j] = parseInt(eventPeople[j]);
            }            
            sortedList.sort(function(a, b){return a-b});
            
            for (var j = 0; j < sortedList.length; j++) {
                //for each person at the event go through the list of the people at the event and count them as a person worked with                
                var personid = sortedList[j];
                for (var x = 0; x < sortedList.length; x++) {
                    if (x !== j){
                        data[mappings[personid]][mappings[sortedList[x]]]++;
                    }
                }
            }
        }
        
        //work out average number of people at events
        var eventAvg = totalPeople / self.events.length;
        
        //work out the average number of people worked with and the most sociaable
        //for each person count how many people they have worked with
        var totalWorkedWith = 0;
        var maxWorkedWith = 0;
        var mostSociable;
        for(var i = 0; i < data.length; i++){
            var workedWith = 0;
            for (var j = i + 1; j < data.length; j++){
                if(data[i][j] !== 0){
                    totalWorkedWith++;
                    workedWith++;
                }
            }
            if (workedWith > maxWorkedWith){
                if ((i !== 0) && (i !== 1)){
                    maxWorkedWith = workedWith;
                    mostSociable = names[i];      
                }
            }
        }
        var avgWorkedWith = totalWorkedWith / data.length;
        
        //now display them in the graph!       
        var width = 720,
                height = 720,
                outerRadius = Math.min(width, height) / 2 - 10,
                innerRadius = outerRadius - 24;

        var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

        var layout = d3.layout.chord()
                .padding(.04)
                .sortSubgroups(d3.descending)
                .sortChords(d3.ascending);

        var path = d3.svg.chord()
                .radius(innerRadius);

        var svg = d3.select("#" + el.id).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("id", "circle")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var circle = svg.append("circle")
                .attr("r", outerRadius);

        // Compute the chord layout.
        layout.matrix(data);

        // Add a group per neighborhood.
        var group = svg.selectAll(".group")
                .data(layout.groups)
                .enter().append("g")
                .attr("class", "group")
                .on("mouseover", mouseover);

        // Add a mouseover title.
        group.append("title").text(function(d, i) {       
            return names[i];
        });
        
        // Add the group arc.
        var groupPath = group.append("path")
            .attr("id", function(d, i) { return "group" + i; })
            .attr("d", arc)
            .style("fill", function(d, i) { return '#aaa' });

        // Add a text label.
        var groupText = group.append("text")
                .attr("x", 6)
                .attr("dy", 15)
                .attr("fill", "white");
        
        groupText.append("textPath")
            .attr("xlink:href", function(d, i) { return "#group" + i; })
            .text(function(d, i) { return names[i]; });

        // Remove the labels that don't fit. (all of them in this case!!)
        groupText.filter(function(d, i) {
            return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength();
        }).remove();
        
        // Add the chords.
        var chord = svg.selectAll(".chord")
                .data(layout.chords)
                .enter().append("path")
                .attr("class", "chord")
                .style("fill", function(d, i) {
                    return colours[d.source.value];        
                })
                .attr("d", path);
        
        // Add an elaborate mouseover title for each chord.
        chord.append("title").text(function(d) { 
            return names[d.source.index]
                    + " has worked with " + names[d.target.index]
                    + " " + d.source.value + " times.";
        });

        function mouseover(d, i) {
            chord.classed("fade", function(p) {
                return p.source.index != i
                        && p.target.index != i;
            });
        } 
        
        function rotate() {
            console.log("start first");
            d3.select("#circle").transition().duration(60000).attr("transform", "translate(360,360)rotate(180)")
                    .each("end", function() {
                        console.log("start second");
                        d3.select('#circle').transition().duration(60000).attr("transform", "translate(360,360)rotate(359)")
                                .each("end", function() {
                                    console.log("start third");
                                    d3.select('#circle').transition().duration(1).attr("transform", "translate(360,360)rotate(0)")
                                            .each("end", function() {
                                                rotate();
                                            });
                                });
                    });
        }        
        rotate();
        
                    
        self.detailsCount = 0;
        //a title
        $title = $('<div class="stat stat-' + self.detailsCount + '"></div>');
        $title.append("<h2>Collaboration Network</h2>Which DTC students have been working with each other");
        $detail.append($title);   
        $title.hide();
        self.detailsCount++;
        
        //total number of events
        $totalEventsDesc = $('<div class="stat stat-' + self.detailsCount + '"></div>');
        $totalEventsDesc.append('DTC members have organised, contributed to, or attended <b>' +
            self.events.length + '</b> different events in total!');
        $detail.append($totalEventsDesc);
        $totalEventsDesc.hide();
        self.detailsCount++;
        
        //average number of people at events
        $eventAvgDesc = $('<div class="stat stat-' + self.detailsCount + '"></div>');
        $eventAvgDesc.append('On average each activity has involved <b>' + eventAvg.toFixed(2) + '</b> students');
        $detail.append($eventAvgDesc);
        $eventAvgDesc.hide();
        self.detailsCount++;
        
        //average number worked with
        $avgWorkedWithDesc = $('<div class="stat stat-' + self.detailsCount + '"></div>');
        $avgWorkedWithDesc.append('And on average each person has worked with <b>' 
                + avgWorkedWith.toFixed(0) + 
                '</b> other members of the DTC.');
        $detail.append($avgWorkedWithDesc);
        $avgWorkedWithDesc.hide();
        self.detailsCount++;        
        
        //most sociable
        $mostSociableDesc = $('<div class="stat stat-' + self.detailsCount + '"></div>');
        $mostSociableDesc.append('(<b>' + mostSociable + '</b> is the most sociable having worked with <b>' +
                maxWorkedWith + '</b> other people)');
        $detail.append($mostSociableDesc); 
        $mostSociableDesc.hide();
        self.detailsCount++;
        
        cb_done();
    }

    self.show = function(cb_done)
    {        
        //calculate interval
        var interval = self.duration / self.facts.length;
        
        var nextFact = function(){
            if (index === 0){
                console.log("show first stat!!!");
                $('.stat-' + self.facts[index]).fadeIn(300, function(){
                    index++;
                });
            }else{
                console.log("show next stat!!!");
                //fade the previous comment
                $('.stat-' + self.facts[index-1]).fadeOut(300, function(){
                    $('.stat-' + self.facts[index]).fadeIn(300, function(){
                        index++;
                    });
                });
            }
        }
        
        //show the various details
        var index = 0;
        nextFact();
        setInterval(nextFact, interval);
            
        // In here you probably don't need to do anything...
        window.setTimeout(cb_done, self.duration);
    }
}


//KSlide_nameList.prototype();