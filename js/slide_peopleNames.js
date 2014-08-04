/**
 * Slide that shows a list of all people in a set of people, with names scaled to number
 * of events - Like a sort of tag cloud
 * 
 * TODO - this shoudl instead receive a list of all events and work out people/event counts
 * based on that list instead (to save on API calls)
 */

function KSlide_nameList(people, events)
{
    var self = this;
    self.people = people;

    self.render = function(el, cb_done)
    {
        console.log("people names");
        
        var index = 0;
        var peopleEvents = new Array();

        if(people.length < 1)
        {
            cb_done();
            return;
        }
        
        // Count events by people
        for(var ei in events)
        {
            var e = events[ei];
            
            for(var pi in e.people)
            {
                var personid = e.people[pi];
                
                if(typeof peopleEvents[personid] == 'undefined')
                {
                    // find the person in the list of people
                    for(var pi2 in people)
                    {
                        var person = people[pi2];
                        if(person.personid === personid)
                            break;
                    }
                    
                    peopleEvents[personid] = {size: 1, text: person.name};
                }
                else
                {
                    peopleEvents[personid].size++;
                }
            }
        }
        
        // 0-index peopleEvents, atm its done by person.PersonID
        var counts = [];
        for(var i in peopleEvents)
        {
            counts.push({text: peopleEvents[i].text, size: Math.log(peopleEvents[i].size)});   
        }
        
        
        console.log(counts);
        
        // Draw the cloud

        var id = '#' + $(el).attr('id');
        $('#body').append(el);  

        var draw = function(words)
        {
            d3.select(id).append("svg")
                    .attr("width", 900)
                    .attr("height", 700)
                    .attr("class", "wordcloud")
                    .append("g")
                    // without the transform, words words would get cutoff to the left and top, they would
                    // appear outside of the SVG area
                    .attr("transform", "translate(320,200)")
                    .selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .style("font-size", function(d) {
                        return d.size + "px";
                    })
                    .style("fill", function(d, i) {
                        return '#fff'; //color(i);
                    })
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .text(function(d) {
                        return d.text;
                    });
        }

        //put the results in el and then call cb_done        
        var color = "#fff"; /*d3.scale.linear()
                .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
                .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);*/

        d3.layout.cloud().size([900, 700])
                .words(counts)
                .rotate(0)
                .fontSize(function(d) {
                    return d.size;
                })
                .on("end", function(words){draw(words); cb_done();})
                .start();
    }


    self.show = function(cb_done)
    {
        // In here you probably don't need to do anything...

        window.setTimeout(cb_done, 3000);
    }
}


//KSlide_nameList.prototype();
