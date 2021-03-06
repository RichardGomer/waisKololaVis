/**
 * Slide that shows an impact, the number of times it has been associated with 
 * an event, the people who have been affected by it and some photos
 */

function KSlide_feature(feature, events, fw, duration)
{
    var self = this;
    self.feature = feature;
    self.events = events;
    self.fw = fw;
    self.duration = duration;
    self.endpoint_url = "http://www.wsdtc.deimpact.org.uk/api/1/";
    self.eventCount;

    self.render = function(el, cb_done)
    {
        //count how many events are associated with the feature and get a list of associated images
        self.eventCount = 0;
        var imageArray = new Array();
        for (var i = 0; i < self.events.length; i++)
        {
            if ($.inArray(self.feature.toString(), self.events[i].features) > -1)
            {
                //count the event
                self.eventCount++;

                //now get the images
                for (var j = 0; j < self.events[i].photos.length; j++)
                {
                    imageArray.push(self.events[i].photos[j].url);
                }
            }
        }

        for (var i = 0; i < self.fw.length; i++)
        {
            if (self.feature == self.fw[i].featureid)
            {
                var statement = self.fw[i].statement;
                var $el = $(el);
                $feature = $('<div class="feature"></div>');
                $feature.append('<div class="feature-statement feature-statement-' + self.feature + '">"' + statement + '"</div>');
                $featureCount = $('<div class="feature-count feature-count-' + self.feature + '"></div>');
                $feature.append($featureCount);
                $el.append($feature);

                $images = $('<div class="images"></div>');
                var imagesShown = 3;
                if (imageArray.length < 3)
                    imagesShown = imageArray.length;
                for (var j = 0; j < imagesShown; j++) {
                    var $img = $("<img class='feature-image'></img>");
                    $img.attr('src', imageArray[j]);
                    $images.append($img);
                }
                $el.append($images);
                break;
            }
        }

        cb_done();
    }
    
    


    self.show = function(cb_done)
    {
        if (self.duration > 2000){
            //work out interval duration
            var interval = (self.duration - 2000) / self.eventCount;
        
            var incrementingCount = 0;
            window.setInterval(function(){
                if (incrementingCount < self.eventCount){
                    incrementingCount++;
                    $('.feature-count-' + self.feature).empty();
                    $('.feature-count-' + self.feature).append(incrementingCount);
                }
            }, interval);
        }else{
            $('.feature-count-' + self.feature).append(self.eventCount);
        }
        
        // In here you probably don't need to do anything...
        window.setTimeout(cb_done, 5000);
    }
}


//KSlide_nameList.prototype();