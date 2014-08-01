/**
 * Event photo slide for KOLOLA video
 *
 * Instantiate with a single event object from the API
 */
 
 function KSlide_EventPhotos(event, time)
 {
        var self = this;
     
        self.render = function(el, cb_done)
        {
            var img;
            for(var i in event.photos)
            {
                el.appendChild(img = document.createElement('img'));
            
                img.src = event.photos[i].url;
            }
            
            var h;
            el.appendChild(h = document.createElement('h1'));
            h.innerHTML = event.name;
            
            cb_done();
        }
        
        self.show = function(cb)
        {
            window.setTimeout(cb, time);   
        }
 }
 