/**
 * Slide that shows a list of all people in a set of people, with names scaled to number
 * of events - Like a sort of tag cloud
 */
 
function KSlide_nameList(people)
{
    var self = this;
    
    self.render = function(el, cb_done)
    {
        // In here you need to render the tag clud into the given element, and call cb_done when you;re finished
    }
    
    self.show = function(cb_done)
    {
        // In here you probably don't need to do anything...
        
        window.setTimeout(cb_done, 5000);
    }
}
 
 
KSlide_nameList.prototype();