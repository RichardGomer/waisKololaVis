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
function KVideo(bpm, element)
{
    var self = this;
    
    self.slides = [];
    self.els = [];
    self.element = element;
    
    self.bpm = bpm;
    
    self.running = false;
    self.runcount = 0;

    self.addSlide = function(slide)
    {
        if(typeof slide.show !== 'function')
        {
            console.error("Cannot add slide with no show() method!", slide);   
            return;
        }
        
        if(typeof slide.render !== 'function')
        {
            console.error("Cannot add slide with no render() method!", slide);
        }   
        
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
        var snum = -1;
        
        // TODO: Start the soundtrack - How will we know when it starts playing?
        var startTime = (new Date).getTime();
        
        if(self.running)
        {
            console.log("Presentation is already running!");
            return;
        }
        
        console.log("Begin presentation at " + startTime + " then ", cb_done);
        
        /**
         * This function progresses to the next slide
         *
         * TODO: Progress after a certain time limit if the slide doesn't call the progression itself?
         */
        self.running = true;
        self.runcount++;
        var runCount = self.runcount;
        var next = function()
        {
            snum++;
            
            // If the presentation has been stopped (or restarted), do nothing
            if(!self.running || self.runcount != runCount)
            {
                return;
            }
            
            // If there are no slides, call the final callback and exit
            if(snum >= self.slides.length)
            {
                console.log("Presentation complete");
                self.running = false;
                cb_done();
                return;
            }
            
            // Wait for the next beat before transitioning
            // Current time
            var now = (new Date).getTime() - startTime;
            
            // Which means we're on beat...
            var msPerBeat = 1000*60 / self.bpm;
            var beatMod = msPerBeat - (now % msPerBeat); // Get the ms until the next beat [ () = ms into current beat ]
            
            window.setTimeout(function(){
                self.transition(self, self.slides[snum], self.els[snum], next);
            }, beatMod);
        }
        
        
        next();
    }
    
    self.stop = function()
    {
        self.running = false;   
    }

    
    // Overload this method to change the transition style!
    // It receives the next slide to be displayed and the callback that should be passed to its trigger method
    self.transition = function(video, slide, el, cb)
    {
        console.log("Transition to", slide, el);
        self.element.innerHTML = ''; // Clear the old slide out of the element
        self.element.appendChild(el); // Append the new slide
        slide.show(cb); // Render the slide and when it's done render the next one
    }
}

