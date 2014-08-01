
function KSlide_connections(all)
{
    var self = this;
    self.all = all;
    self.people = all.people;
    self.events = all.events;
    self.endpoint_url = "http://www.wsdtc.deimpact.org.uk/api/1/";

    self.render = function(el, cb_done)
    {        
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
        
        //now go through all events
        var events = self.events;
        for (var i = 0; i < events.length; i++) {
            //for each event go through each person
            var eventPeople = events[i].people;
            
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
                    data[mappings[personid]][mappings[sortedList[x]]]++;
                }
            }
        }
        
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

        svg.append("circle")
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
                .attr("dy", 15);
        
        groupText.append("textPath")
            .attr("xlink:href", function(d, i) { return "#group" + i; })
            .text(function(d, i) { return names[i]; });

        // Remove the labels that don't fit. (all of them in this case!!)
        groupText.filter(function(d, i) {
            return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength();
        })
                .remove();
        
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
        
        cb_done();
    }

    self.show = function(cb_done)
    {
        // In here you probably don't need to do anything...

        window.setTimeout(cb_done, 5000);
    }
}


//KSlide_nameList.prototype();