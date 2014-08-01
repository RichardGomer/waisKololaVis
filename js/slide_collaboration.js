        function getCollabNet(events)
        {
            var edges = {};
            for (var i in events)
            {
                for(var p in events[i].people)
                {
                    var personid = events[i].people[p];

                    if (typeof edges[personid] === 'undefined')
                    {
                        edges[personid] = {};
                    }

                    for (var p2 in events[i].people)
                    {
                        var personid2 = events[i].people[p2];

                        if (typeof edges[personid][personid2] === 'undefined')
                        {
                            edges[personid][personid2] = 1;
                        }
                        else
                        {
                            edges[personid][personid2]++;
                        }
                    }
                }
            }

            return edges;
        }

function KSlide_collaboration(net, people)
{
    var self = this;
    
    var arrayUnique = function(a) {
        return a.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    };
    
    self.render = function(el, cb_done)
    {
            console.log("Render net", net);
        
            var g = {edges: [], nodes: []};
            var nodes = [];

            // Create edges, with weights
            for(var from in net)
            {
                var edges = net[from];

                for(var to in net)
                {
                    nodes.push(from.toString());
                    nodes.push(to.toString());
                    g.edges.push({id: "e_" + to + "_" + from, source: from, target: to, size: net[from][to]});
                }
            }
        
            console.log(g);

            // Remove duplicate nodes
            var nodeList = arrayUnique(nodes);

            // Create a list of names from the people objects
            var names = [];
            for(var j in people)
            {
                var p = people[j];
                names[p.personid] = p.name;
            }
        
            // Add all the nodes, labelled with the person's name
            for(var i in nodeList)
            {
                g.nodes.push({'id': nodeList[i].toString(), 'x': Math.random(), 'y': Math.random(), 'size': 2, 'label': names[nodeList[i]]});
            }

            el.style.width = "600px";
            el.style.height = "500px";
        
            var s = new sigma({
                graph: g,
                container: el,
                settings: {
                    drawEdges: true,
                    edgeColor: 'default',
                    defaultEdgeColor: '#ccc',
                    maxEdgeSize: 10,
                    minEdgeSize: 1
                }
            });

            s.startForceAtlas2();
            window.setTimeout(function(){s.stopForceAtlas2(); cb_done();}, 1500); 
    }
    
    self.show = function(cb)
    {
        window.setTimeout(cb, 3000);   
    }
}