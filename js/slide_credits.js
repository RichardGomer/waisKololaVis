
function KSlide_credits(people)
{
    var self = this;
    self.people = people;    

    self.render = function(el, cb_done)
    {              
        console.log("credits!!!");
        
        //sort people into alphabetical order
        function compare(a,b) {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        }
        self.people.sort(compare);
        
        //display the names
        var $el = $(el);
        $el.append('<div class="title">You have been watching...</div>');
        $entries = $('<div></div>');
        $entries.addClass('entries');
        for(var i = 0; i < self.people.length; i++){  
            $entry = $('<div></div>');
            $entry.addClass('entry');
            $name = $('<div class="name">' + self.people[i].name + '</div>');
            $avatarLeft = $('<div class="avatar avatar-left"></div>');
            $avatarRight = $('<div class="avatar avatar-right"></div>');
            if (i % 2 === 0){          
                $avatarLeft.append('<img src="' + self.people[i].avatar + '"/>');
            }else{
                $avatarRight.append('<img src="' + self.people[i].avatar + '"/>');         
            }
            $entry.append($avatarLeft).append($name).append($avatarRight);
            $entries.append($entry);            
        }
        $el.append($entries);                       

        cb_done();
    }

    self.show = function(cb_done)
    {
        console.log("cue credits");
        setInterval(function() {
            var pos = $('.entries').scrollTop();
            $('.entries').scrollTop(pos + 2);
        }, 50);
        
        window.setTimeout(cb_done, 60000);
    }
}
