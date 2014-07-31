/**
 * Slide that shows a list of all people in a set of people, with names scaled to number
 * of events - Like a sort of tag cloud
 */

function KSlide_nameList(people)
{
    var self = this;
    self.people = people;
    self.endpoint_url = "http://www.wsdtc.deimpact.org.uk/api/1/";

    self.render = function(el, cb_done)
    {
        var index = 0;
        var peopleEvents = new Array();
        countEvents();

        function countEvents() {
            var user = people[index];
            var username = user.username;
            var name = user.name;
            var client = new KOLOLA(self.endpoint_url);
            client.query('user:' + username, function(events) {                
                var entry = {"text": name, "size": events.length};
                peopleEvents.push(entry);
                if (index < self.people.length - 1) {
                    index++;
                    countEvents();
                } else {
                    //put the results in el and then call cb_done        
                    var color = d3.scale.linear()
                            .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
                            .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

                    d3.layout.cloud().size([800, 300])
                            .words(peopleEvents)
                            .rotate(0)
                            .fontSize(function(d) {
                                return d.size;
                            })
                            .on("end", draw)
                            .start();

                    function draw(words) {
                        d3.select("#test").append("svg")
                                .attr("width", 850)
                                .attr("height", 350)
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
                                    return color(i);
                                })
                                .attr("transform", function(d) {
                                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                                })
                                .text(function(d) {
                                    return d.text;
                                });
                    }

                }
            }, function() {
            }); //wants something for cbpeople so give it blank function;
        }

        // In here you need to render the tag cloud into the given element, and call cb_done when you;re finished
    }


    self.show = function(cb_done)
    {
        // In here you probably don't need to do anything...

        window.setTimeout(cb_done, 5000);
    }
}


//KSlide_nameList.prototype();