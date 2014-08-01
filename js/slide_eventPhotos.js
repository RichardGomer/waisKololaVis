/**
 * Event photo slide for KOLOLA video
 *
 * Instantiate with a single event object from the API
 */
 
 function KSlide_EventPhotos(event, people, time)
 {
        var self = this;
     
        self.render = function(el, cb_done)
        {
            self.el = el;
            
            var h;
            el.appendChild(h = document.createElement('h1'));
            h.innerHTML = event.name;
            
            // Add people avatars
            var p;
            el.appendChild(p = document.createElement('div'));
            p.setAttribute('class', 'avatars');
            
            // find the person in the list of people
            for(var i in event.people)
            {
                var personid = event.people[i];
                var person;
                
                for(var pi2 in people)
                {
                    person = people[pi2];
                    if(person.personid === personid)
                        break;
                }
                
                var a;
                p.appendChild(a = document.createElement('img'));
                a.src = person.avatar;
            }
            
            cb_done();
        }
        
        self.show = function(cb)
        {
            var img = [];
            for(var i in event.photos)
            {
                img.push(event.photos[i].url);   
            }
            
            $(self.el).backstretch(img, {duration: time-200, fade: 200});
            
            window.setTimeout(function(){cb();}, time*event.photos.length);   
            window.setTimeout(function(){$(self.el).backstretch("destroy", false);}, time * event.photos.length + 1000);
        }
 }
 