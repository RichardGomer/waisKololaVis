
function KSlide_impactType(events)
{
    var self = this;
    self.events = events;
    self.endpoint_url = "http://www.wsdtc.deimpact.org.uk/api/1/";

    self.render = function(el, cb_done)
    {              
        //get the framework
        var endpoint_url = "http://www.wsdtc.deimpact.org.uk/api/1/"; // For example
        var client = new KOLOLA(endpoint_url);
        client.getFramework(function(fw) {

            console.log("Received framework", fw);
            
            //create a mapping of features to indictators
            //and create an objetc to count indicator occurrences
            var frameworkMappings = {};
            var indicatorCount = {};
            for (var i = 0; i < fw.length; i++) {
                frameworkMappings[fw[i].featureid] = fw[i].framework.indicator;
                indicatorCount[fw[i].framework.indicator] = 0;
            }

            //go through each event and get the features
            for (var i = 0; i < self.events.length; i++) {
                var features = self.events[i].features;
                //go through each feature and get it's associated indicator
                //keep a record of any indicators that have already been counted for this event
                var recordedIndicators = [];
                for (var j = 0; j < features.length; j++) {
                    var indicator = frameworkMappings[features[j]];
                    if ($.inArray(indicator, recordedIndicators) === -1) {
                        //not been counted yet
                        indicatorCount[indicator]++;
                        recordedIndicators.push(indicator);
                    }
                }
            }
            
            var data = [];
            for(indicator in indicatorCount){
                data.push({"indicator" : indicator, "count" : indicatorCount[indicator]});
            }
            
            //now draw the graph
            var margin = {top: 20, right: 20, bottom: 120, left: 40},
            width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;
                    
                   // var margin = {top: 30, right: 40, bottom: 50, left: 50},

            var formatPercent = d3.format(".0%");

            var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1, 1);

            var y = d3.scale.linear()
                    .range([height, 0]);

            var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

            var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

            var svg = d3.select("body").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(data.map(function(d) {
                return d.indicator;
            }));
            
            y.domain([0, d3.max(data, function(d) {
                return d.count;
            })]);

            svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", function(d) {
                        return "rotate(-65)"
                    });
        
            svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Frequency");

                svg.selectAll(".bar")
                        .data(data)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", function(d) {
                            return x(d.indicator);
                        })
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) {
                            return y(d.count);
                        })
                        .attr("height", function(d) {
                            return height - y(d.count);
                        })
                        .append("title").text(function(d){
                            return d.indicator;                          
                        });

                //d3.select("input").on("change", change);

                //var sortTimeout = setTimeout(function() {
                //    d3.select("input").property("checked", true).each(change);
                //}, 2000);

                function change() {
                    clearTimeout(sortTimeout);

                    // Copy-on-write since tweens are evaluated after a delay.
                    var x0 = x.domain(data.sort(this.checked
                            ? function(a, b) {
                                return b.count - a.count;
                            }
                    : function(a, b) {
                        return d3.ascending(a.indicator, b.indicator);
                    })
                            .map(function(d) {
                                return d.indicator;
                            }))
                            .copy();

                    var transition = svg.transition().duration(750),
                            delay = function(d, i) {
                                return i * 50;
                            };

                    transition.selectAll(".bar")
                            .delay(delay)
                            .attr("x", function(d) {
                                return x0(d.indicator);
                            });

                    transition.select(".x.axis")
                            .call(xAxis)
                            .selectAll("g")
                            .delay(delay);
                }
            
            cb_done();
        });      
    }

    self.show = function(cb_done)
    {
        window.setTimeout(cb_done, 5000);
    }
}
