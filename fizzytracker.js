// THIS TRACKER SCRIPT HAS BEEN CREATED BY FIZZY (https://fizzyelf.jcink.net/index.php?showtopic=10)
// ALL CREDITS TO FIZZY
// THE SCRIPT IS ONLY HOSTED BY YUEN HERE WITH SPECIFIC MODIFICATIONS PERTAINING TO WHERE THE THE WIND DECIDES (https://halfwild.jcink.net/)

function fizzyTracker(characterName, previousPoster)
{
//*** CONFIGURATION ***//

//To specify which character to track, put the account name on the next line
//if left blank, will attempt to default to the posting account.
const Character_Name = characterName;

//Alternately, to specify which character to track, put the class/identifier of the element containing the poster's name
//You may need to do it this way if your character's name contains symbols, accents, or non-English characters
const Character_Name_Class = ".normalname"

//To specify who posts immediately before you when using strict posting order, put them
//on the next line e.g. {12:"Character Name", 34: "Other Character"}
const Previous_Poster = previousPoster;

//To specify that certain forums should be ignored, put them on the next lines
//(You do not have to use both)
//e.g. Ignore_Forums = ["Approved Characters", "Plotting"]
//e.g. Ignore_Forum_IDs = ["1", "2"]
const Ignore_Forums = ["math", "season 1", "season 2", "season 3", "season 4", "season 5", "season 6", "season 7", "season 8", "season 9", "season 10", "season 11", "season 12", "the bulletin", "clubs", "events", "subplots", "the utilities", "templates", "processing", "incomplete", "claims", "abstruse", "witch", "shifter", "werewolf", "fae", "merfolk", "vampire", "spirit", "mythical", "faculty", "townsfolk", "platonic", "family", "romance", "groups", "mixed", "ayo", "castle", "emily", "exodin", "ina", "io", "j", "joei", "nyorobon", "kismyth", "lili", "manda", "mina", "molly", "moth", "silv", "tolvagary", "turtle", "yuen", "mish", "eykta", "crystal", "time lapse", "online networks", "subgroups", "applications", "misc", "the archives", "year 1", "year 2", "year 3", "previous events", "6 months!", "completed", "general", "wonderland"];
const Ignore_Forum_IDs = [];

//if your skin has changed the icons/macros this might need to be changed
//value for jcink default skin: "img[title=Closed]";
const Locked_Thread_Definition = "img[title=Closed]";

//if your board moves finished threads into a separate forum, set that here
const Archived_Thread_Forum = "the archives";

//if the icons don't show up, try changing this to false
const Skin_Already_Uses_Fontawesome = false;

//if you are using multiple of this tracker in the same thread, and you get a flood control error, try increasing this
const Next_Tracker_Delay = 5;

//*** END OF CONFIGURATION AREA ***//

const scriptelements = document.getElementsByTagName("script");
const Current_Script = scriptelements[scriptelements.length - 1];
const Is_Mobile = (document.getElementById("mobile") !== null);

function loadJsFile(filename, callback) {
   let fileref = document.createElement('script')
   fileref.setAttribute("type", "text/javascript")
   fileref.setAttribute("src", filename)
   if (callback) {
       fileref.onreadystatechange = callback;
       fileref.onload = callback;
   }
   document.head.appendChild(fileref);
}

(Skin_Already_Uses_Fontawesome && !Is_Mobile) || loadJsFile('https://kit.fontawesome.com/fccaf1af24.js');

const startLoadParticipatedTracker = function () {
   const Open_Thread_Wrapper = $("<div class='fizztrackerwrap'></div>");
   $(Current_Script).before(Open_Thread_Wrapper);

   let trackedcharacter = "";
   if (Character_Name.trim() != "") trackedcharacter = $('<div ></div>').html(Character_Name.trim()).text();
   if (trackedcharacter == "") {
       if (Is_Mobile) trackedcharacter = $(Current_Script).closest(".mobile-post").find(".post-username").text().trim();
       else trackedcharacter = $(Character_Name_Class).last().text().trim();
   }
   console.log(trackedcharacter);
   Open_Thread_Wrapper.append(`<p>Active</p>`);

   if (trackedcharacter == "") {
       Open_Thread_Wrapper.append("<div class='fizzlist-item'>Please specify a character to track.</div>");
       return;
   }
   let sessionid;
   if (Is_Mobile) { setTimeout(() => { FillParticipatedTrackerMobile(trackedcharacter, 0) }, Next_Tracker_Delay * 1000 * trackernum); }
   else { setTimeout(() => { FillParticipatedTracker(trackedcharacter, 0) }, Next_Tracker_Delay * 1000 * trackernum); }


   const thistracker = $("<div></div>");

   $(Open_Thread_Wrapper).append(thistracker);

   async function FillParticipatedTracker(username, page) {
       console.log(username);
       let doc;

       if (sessionid) {
           let href = `/index.php?act=Search&CODE=show&searchid=${sessionid}&result_type=topics&hl=&f=&u=${username.replace(' ', '%20')}&st=${page * 25}`;
           let data = '';
           try {
               console.log(`fetching ${href}`);
               data = await $.get(href);
               console.log('success.');
           } catch (err) {
               console.log(`Ajax error loading page: ${href} - ${err.status} ${err.statusText}`);
               thistracker.append('<div class="fizztracker-item">Search Failed</div>');
               return;
           }
           doc = new DOMParser().parseFromString(data, 'text/html');
       } else {
           let href = `/index.php?act=Search&q=&f=&u=${username.replace(' ', '%20')}&rt=topics&st=${page * 25}`;
           let data = '';
           try {
               console.log(`fetching ${href}`);
               data = await $.get(href);
               console.log('success.');
           } catch (err) {
               console.log(`Ajax error loading page: ${href} - ${err.status} ${err.statusText}`);
               thistracker.append('<div class="fizztracker-item">Search Failed</div>');
               return;
           }
           doc = new DOMParser().parseFromString(data, 'text/html');
           console.log(data)
           console.log(doc)
           let meta = $('meta[http-equiv="refresh"]', doc);
           if (meta.length) {
               href = meta.attr('content').substr(meta.attr('content').indexOf('=') + 1);
               sessionid = href.match(/&searchid=([a-zA-Z0-9]+)&/)[1];
               console.log('sessionid = ' + sessionid);
               try {
                   console.log(`fetching ${href}`);
                   data = await $.get(href);
                   console.log('success.');
               } catch (err) {
                   console.log(`Ajax error loading page: ${href} - ${err.status} ${err.statusText}`);
                   thistracker.append('<div class="fizztracker-item">Search Failed</div>');
                   return;
               }
           } else {
               let boardmessage = $('#board-message .tablefill .postcolor', doc).text();
               thistracker.append(`<div class="fizztracker-item">${boardmessage}</div>`);
               return;
           }
           doc = new DOMParser().parseFromString(data, 'text/html');
       }

       $('#search-topics .tablebasic > tbody > tr', doc).each(function (i, e) {
           if (i > 0) {
               let cells = $(e).children('td');
               const location = $(cells[3]).text();
               const location_id = $(cells[3]).find('a').attr('href').match(/showforum=([^&]+)&?/)[1]
               if (!Ignore_Forums.includes(location) && !Ignore_Forum_IDs.includes(location_id) ) {
                   const locked = (!$(cells[0]).find(Locked_Thread_Definition).length == 0 || location == Archived_Thread_Forum);
                   const title = $(cells[2]).find('td:nth-child(2) > a').text();
                   const threadDesc = $(cells[2]).find('.desc').text();
                   let descSeparator = "";
                   if (threadDesc) descSeparator = "|";
                   const href = $(cells[7]).children('a').attr('href');
                   const threadID = href.match(/showtopic=([^&]+)&?/)[1];
                   const lastPoster = $(cells[7]).find('b a').text();
                   if (Previous_Poster[threadID]) {
                       var myturn = (lastPoster.includes(Previous_Poster[threadID])) ? 'fa-arrow-right' : 'fa-check';
                   } else {
                       var myturn = (lastPoster.includes(trackedcharacter)) ? 'fa-check' : 'fa-arrow-right';
                   }
                   let postDate = $(cells[7]).html();
                   postDate = postDate.substr(0, postDate.indexOf('<'));
                   if (locked) {
                       thishistory.append($(`<div class="fizztracker-item"><b><a href="${href}">${title}</a></b><br />
               <div>located in <b>${location}</b> ${descSeparator} ${threadDesc}</div></div>`));
                   } else {
                       thistracker.append($(`<div class="fizztracker-item"><b>
               <span class="status fas ${myturn}"></span><a href="${href}">${title}</a></b>
               <div>located in <b>${location}</b> ${descSeparator} ${threadDesc} <br /> Last Post by <b>${lastPoster}</b><br /><i>posted ${postDate}</i></div></div>`));
                   }
               }
           }

       });
       console.log($('#search-topics .tablebasic > tbody > tr', doc).length + ' rows found on page ' + page);
       page = page + 1;
       if ($('#search-topics .tablebasic > tbody > tr', doc).length == 26) {
           setTimeout(() => { FillParticipatedTracker(trackedcharacter, page) }, Next_Tracker_Delay * 1000 * trackernum);
       } else {
           if (!thistracker.children()) {
               thistracker.append('<div class="fizztracker-item">None</div>');
           }
           if (!thishistory.children()) {
               thishistory.append('<div class="fizztracker-item">None</div>');
           }
       }
   }

   async function FillParticipatedTrackerMobile(username, page) {
       console.log(username);
       let doc;
       let href = `/index.php?act=Search&q=&f=&u=${username.replace(' ', '%20')}&rt=topics&st=${page * 25}`;
       let data = '';
       try {
           console.log(`fetching ${href}`);
           data = await $.get(href);
           console.log('success.');
       } catch (err) {
           console.log(`Ajax error loading page: ${href} - ${err.status} ${err.statusText}`);
           thistracker.append('<div class="fizztracker-item">Search Failed</div>');
           return;
       }
       doc = new DOMParser().parseFromString(data, 'text/html');
       $('.touch-area', doc).each(function (i, e) {
           if (i > 0) {
               let cells = $(e).children('div');
               console.log("in touch area " + i);
               console.log(cells)
               const location = '';
               const threadDesc = '';
               const locked = (!$(cells[0]).find(Locked_Thread_Definition).length == 0);
               const title = $(cells[1]).find('a:first-child').text();
               const href = $(cells[1]).find('a').first().attr('href');
               console.log(locked, title, href);
               const threadID = href.match(/showtopic=([^&]+)&?/)[1];
               const lastPoster = $(cells[1]).find('.touch-area-text a').text();
               if (Previous_Poster[threadID]) {
                   var myturn = (lastPoster.includes(Previous_Poster[threadID])) ? 'fa-arrow-right' : 'fa-check';
               } else {
                   var myturn = (lastPoster.includes(trackedcharacter)) ? 'fa-check' : 'fa-arrow-right';
               }
               let postDate = $(cells[1]).find('.touch-area-text').html();
               postDate = postDate.substr(0, postDate.indexOf('<br>') + 4);
               if (locked) {
                   thishistory.append($(`<div class="fizztracker-item"><b><a href="${href}">${title}</a></b></div>`));
               } else {
                   thistracker.append($(`<div class="fizztracker-item"><b>
               <span class="status fas ${myturn}"></span><a href="${href}">${title}</a></b>
               <div>Last Post by <b>${lastPoster}</b><br /><i>posted ${postDate}</i></div></div>`));
               }
           }
       });
       console.log($('.touch-area', doc).length + ' rows found on page ' + page);
       page = page + 1;
       if ($('.touch-area', doc).length == 25) {
           setTimeout(() => { FillParticipatedTracker(trackedcharacter, page) }, Next_Tracker_Delay * 1000 * trackernum);
       } else {
           if (!thistracker.children()) {
               thistracker.append('<div class="fizztracker-item">None</div>');
           }
           if (!thishistory.children()) {
               thishistory.append('<div class="fizztracker-item">None</div>');
           }
       }
   }

}

if (window.jQuery) {
   startLoadParticipatedTracker();
}
else {
   loadJsFile('https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js', startLoadParticipatedTracker);
}

}
