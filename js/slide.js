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
    self.show = function(cb_done) { }; 
    
    
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
        
        var temp = document.createElement('div');
        temp.setAttribute('class', 'temprender');
        document.body.appendChild(temp);
        
        //console.log("Rendering slides", self.slides);
        
        var snum = -1;
        var next = function()
        {
            snum++;
            
            //console.log("Slide", snum, "of", self.slides.length, "is", self.slides[snum]);
            
            // If there are no slides, call the final callback and exit
            if(snum >= self.slides.length)
            {
                cb_done();
                return;
            }
            
            self.els[snum] = document.createElement('div'); // Create an element to render into
            self.els[snum].setAttribute('id', 'slide_' + snum);
            self.els[snum].setAttribute('class', 'slide ' + self.slides[snum].constructor.name);
            
            temp.appendChild(self.els[snum]);
            
            console.log("Render slide " + snum + " of " + self.els.length);
            self.slides[snum].render(self.els[snum], next); // Render the slide and when it's done render the next one
        }
        
        next();
    }
    
    /**
     * Get the rendered slide elements
     */
    self.getSlides = function()
    {
        return self.els;
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
        
        // TODO: Start the soundtrack - How will we know when it starts playing?
        var startTime = (new Date).getTime();
        
        /**
         * This function progresses to the next slide
         *
         * TODO: Wait until the next transition point in the soundtrack?
         * TODO: Progress after a certain time limit if the slide itself doesn't call the progression itself?
         */
        var next = function()
        {
            snum++;
            
            // If there are no slides, call the final callback and exit
            if(snum >= self.slides.length)
            {
                console.log("Presentation complete");
                cb_done();
                return;
            }
            
            // TODO: Set a timeout that waits for the next transition point here
            self.transition(self.els[snum]);
        }
        
        
        next();
    }

    
    // Overload this method to change the transition style!
    // It receives the next slide to be displayed and the callback that should be passed to its trigger method
    self.transition = function(next, cb)
    {
        self.element.innerHTML = ''; // Clear the old slide out of the element
        self.element.appendChild(next); // Append the new slide
        next.trigger(cb); // Render the slide and when it's done render the next one
    }
}

