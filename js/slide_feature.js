/**
 * Slide that shows an impact, the number of times it has been associated with 
 * an event, the people who have been affected by it and some photos
 */

function KSlide_feature(feature, events)
{
    var self = this;
    self.feature = feature;
    self.events = events;
    self.endpoint_url = "http://www.wsdtc.deimpact.org.uk/api/1/";

    self.render = function(el, cb_done)
    {
        //count how many events are associated with the feature and get a list of assoicated images
        var eventCount = 0;
        var imageArray = new Array();
        for (var i = 0; i < self.events.length; i++)
        {
            if ($.inArray(self.feature.toString(), self.events[i].features) > -1)
            {
                //count the event
                eventCount++;

                //now get the images
                for (var j = 0; j < self.events[i].photos.length; j++)
                {
                    imageArray.push(self.events[i].photos[j].thumb);
                }
            }
        }

        //get the feature statement
        var client = new KOLOLA(self.endpoint_url);
        client.getFramework(function(fw) {
            for (var i = 0; i < fw.length; i++)
            {
                if (self.feature == fw[i].featureid)
                {
                    var statement = fw[i].statement;
                    var $el = $(el);
                    $el.append("<div class='feature-statement'>" + statement + "</div>");
                    $el.append("<div class='feature-count'>" + eventCount + "</div>");
                    for(var j = 0; j < imageArray.length; j++){
                        var $img = $( "<img class='feature-image'></img>");
                        $img.attr('src', imageArray[j]);
                        $el.append($img);
                    }
                    break;
                }
            }
        });
    }


    self.show = function(cb_done)
    {
        // In here you probably don't need to do anything...

        window.setTimeout(cb_done, 5000);
    }
}


//KSlide_nameList.prototype();