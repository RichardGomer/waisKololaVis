/**
 *
 * KOLOLA Videoisation
 *
 */

/**
 * A KSlide is the basic unit of the video - It contains something nice to look at, like a graph,
 * some photos or a video maybe.
 */
function KSlide(apiclient)
{
    var self = this;
    
    self.apiclient = apiclient;
    
    /**
     * This is called when its time to render the slide into the given element.  This may happen some time
     * before the slide is actually displayed, though.  When rendering is complete, call cb_done
     */
    self.render = function(el, cb_done) { };
    
    // This is called when the slide is displayed - It's passed a callback that should be called when the slide has finished
    self.trigger = function(cb_done) { }; 
    
    
}

/**
 * A KVideo contains multiple slides - It renders them and displays them one at a time, maybe with some music and
 * transitions etc.
 *
 * apiclient is a KOLOLA apiclient and element is a DOM element that the presentation will be rendered into
 */
function KVideo(apiclient, element)
{
    var self = this;
    
    self.slides = [];
    self.els = [];
    self.element = element;
    
    self.addSlide = function(slide)
    {
        self.slides.push(slide);  
    };
    
    self.render = function(cb_done)
    {
        // Clear any existing renderings
        self.els = [];
        
        var snum = 0;
        var next = function()
        {
            snum++;
            
            // If there are no slides, call the final callback and exit
            if(snum <= self.slides.length)
            {
                cb_done();
                return;
            }
            
            self.els[snum] = el = document.createElement('div'); // Create an element to render into
            self.slides[snum].render(el, next); // Render the slide and when it's done render the next one
        }
        
        next();
    }
    
    /**
     * Show the presentation - We assume it has already been rendered!
     *
     * cb_done is called when the presentation has finished
     *
     * TODO: We should support different drivers (reveal.js, impress.js etc.)
     *       This would need to be split into two stages: 1) initial setup/layout and 2) actual presentation
     */ 
    self.show = function(cb_done)
    {
        var snum = 0;
        var next = function()
        {
            snum++;
            
            // If there are no slides, call the final callback and exit
            if(snum <= self.slides.length)
            {
                cb_done();
                return;
            }
            
            self.element.innerHTML = ''; // Clear the old slide out of the element
            self.element.appendChild(self.els[snum]); // Append the new slide
            self.slides[snum].trigger(next); // Render the slide and when it's done render the next one
        }
        
        next();
    }
}
