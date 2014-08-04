var previous = false;
var container = false;
var A = 0;

function awesomeTransition(video, slide, el, cb)
{
    var main = video.element;
    
    if(!container)
    {
        video.element.innerHTML = "";
        container = document.createElement('div');
        video.element.appendChild(container);
        
        main.style.perspective = "5000px";
        //main.style.border = "1px solid red";
        main.style.width = "1024px";
        main.style.height = "768px";
        
        //container.style.border = "1px solid lime";
        container.style.position = "absolute";
        container.style.transformStyle = "preserve-3d";
        container.style.width="100%";
        container.style.height = "100%";
    }
    
    
    
    container.appendChild(el); // Add the new slide

    var lastA = A;
    A = A + Math.PI/4; // Increase A
    
    var w = Math.max(500, $(el).width());
    var radius = (w/2) / Math.tan(Math.PI/4);
    
    
    // Set element styles
    if(previous)
    {
        //previous.style.border = "1px solid blue";
    }
    
    el.style.position = 'absolute';
    el.style.top = 0;
    el.style.left = 0;
    //el.style.border = "1px solid yellow";
    
    // Put the new slide in position
    el.style.transform = "rotateY("+A+"rad) translateZ("+radius+"px)";
    

    var start = (new Date()).getTime();
    var duration = 300;
    var update = function()
    {
        var progress = Math.min(((new Date()).getTime() - start) / duration, 1);
        
        var newA = ((A - lastA) * progress) + lastA;
        var newpos = "translateZ("+(-1*Math.round(radius))+"px) rotateY("+(-1* Math.round(newA*1000)/1000)+"rad)";
        //console.log(progress, "Rotate container to", newpos, "versus slide", el.style.transform);
        
        container.style.transform = newpos;
            
        if(progress < 1)
            window.setTimeout(update, 10);
    }
    
    update();
    
    // Do the animation then remove the old slide
    var then = function()
    {
        if(previous)
            container.removeChild(previous); // Remove the old slide

        slide.show(cb);
        previous = el;
    }
    
    window.setTimeout(then, duration);
}