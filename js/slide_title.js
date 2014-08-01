/**
 * Event photo slide for KOLOLA video
 *
 * Instantiate with a single event object from the API
 */
 
function KSlide_title(text, time)
{
    var self = this;

    self.render = function(el, cb_done)
    {
        self.el = el;

        var h;
        el.appendChild(h = document.createElement('h1'));
        h.innerHTML = text;

        cb_done();
    }

    self.show = function(cb)
    {
        window.setTimeout(function(){cb();}, time);   
    }
}
