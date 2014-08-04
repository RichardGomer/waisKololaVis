
function KSlide_credits(people)
{
    var self = this;
    self.people = people;    

    self.render = function(el, cb_done)
    {              
        $('#' + el.id).addClass('KSlide_Credits');
        
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
        $('#' + el.id).append('<div class="title">You have been watching...</div>');
        $entries = $('<div></div>');
        $entries.addClass('entries');
        for(var i = 0; i < self.people.length; i++){  
            $entry = $('<div></div>');
            $entry.addClass('entry');
            $name = $('<div class="name">' + self.people[i].name + '</div>');
            $avatar = $('<div class="avatar"><img src="' + self.people[i].avatar + '"/></div>');                                
            if (i % 2 === 0){          
                $avatar.addClass('left');
                $entry.append($avatar);
                $entry.append($name);                
            }else{
                $avatar.addClass('right');
                $entry.append($name);
                $entry.append($avatar);                
            }
            $entries.append($entry);            
        }
        $('#test').append($entries);
               
        setInterval(function() {
            var pos = $entries.scrollTop();
            $entries.scrollTop(pos + 2);
        }, 100);

        
    }

    self.show = function(cb_done)
    {
        window.setTimeout(cb_done, 5000);
    }
}
