
function KSlide_credits(people)
{
    var self = this;
    self.people = people;    

    self.render = function(el, cb_done)
    {              
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

        var $entries = $('<div class="entries"><span class="title">You have been watching...</span></div>');
        for(var i = 0; i < self.people.length; i++)
        {  
            var $entry = $('<div></div>');
            $entry.addClass('entry');
            
            var $name = $('<div class="name">' + self.people[i].name + '</div>');
            var $avatarLeft = $('<div class="avatar avatar-left"></div>');
            var $avatarRight = $('<div class="avatar avatar-right"></div>');
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
        var scroll = function()
        {
            var pos = $('.entries').scrollTop();
            $('.entries').scrollTop(pos + 3);
            window.setTimeout(scroll, 30);
        }
        
        window.setTimeout(scroll, 30);
        
        window.setTimeout(cb_done, 240000);
    }
}
