/**
 * Event photo slide for KOLOLA video
 *
 * Instantiate with a single event object from the API
 */
 
 function KSlide_EventPhotos(event)
 {
 
        self.render = function(el, cb_done)
        {
            var img;
            for(var i in event.photos)
            {
                el.appendChild(img = document.createElement('img'));
            
                img.src = event.photos[i].url;
            }
            
            
            cb_done();
        }
 }
 
 KSlide_EventPhotos.prototype = KSlide;