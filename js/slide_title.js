/**
 * Event photo slide for KOLOLA video
 *
 * Instantiate with a single event object from the API
 */
 
function KSlide_title(text, time, extra)
{
    var self = this;

    self.render = function(el, cb_done)
    {
        self.el = el;

        var h;
        $(el).append('<h1>' + text + '</h1>');
        $(el).append('<div>' + extra + '</div>');

        cb_done();
    }

    self.show = function(cb)
    {
        window.setTimeout(function(){cb();}, time);   
    }
}
