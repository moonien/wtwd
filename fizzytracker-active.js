// THIS TRACKER SCRIPT HAS BEEN CREATED BY FIZZY (https://fizzyelf.jcink.net/index.php?showtopic=10)
// ALL CREDITS TO FIZZY
// THE SCRIPT IS ONLY HOSTED BY YUEN HERE WITH SPECIFIC MODIFICATIONS PERTAINING TO WHERE THE THE WIND DECIDES (https://halfwild.jcink.net/)

document.write(`<style>
@import url('https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css');
.fizztrackerwrap, .fizzhistorywrap {position: relative; max-width: 500px; margin: 10px auto; padding: 1px 15px;}
.fizztrackerwrap p, .fizzhistorywrap p {
    position: relative;
    font-size: 1.2em;
    border-bottom: 1px solid;
    padding-bottom: 0.35em;
    display: flex;
    justify-content: space-between;
    font-family: Palatino, Palatino Linotype, Palatino LT STD, Book Antiqua, Georgia, serif;
}
.fizzthreadwrap {display: block; position: relative; text-decoration: none;}
.tracker-item {margin-left: 2em; margin-bottom: 0.5em;}
.fizztrackerwrap .tracker-item {text-indent: -1.75em;}
.tracker-item .status {width: 1.5em; text-align: center;font-family: serif; display: inline-block; line-height: 1}
.tracker-item .caughtup {color: green;}
.tracker-item .myturn {color: firebrick}
.tracker-item * {text-indent: 0;}
.tracker-item hr { border: 0; height: 1px; background: #8885; margin: 0.5em 12%;}
.fizzhistorywrap + span[style="font-size: 90%;"] + script + span[style="font-size: 90%;"] {display: none;}
</style>`);

function loadJsFile(filename, ifNotExists, callback ) {
    if (!ifNotExists)  {
        let fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
        if (callback) {
            fileref.onreadystatechange = callback;
            fileref.onload = callback;
        }
        document.head.appendChild(fileref);
    } else if (callback) {
        callback();
    }
}

function createTrackerElements (params, Current_Script) {

    const Open_Thread_Wrapper = $("<div class='fizztrackerwrap'></div>");
    const Alt_Thread_Wrapper = $("<div class='fizztrackerwrap' style='display:none;'></div>");
    $(Current_Script).before(Open_Thread_Wrapper);
    $(Current_Script).before(Alt_Thread_Wrapper);

    params.thisTracker = $(`<div id="track${params.characterName.replace(/[^a-zA-Z]/g, '')}"></div>`);
    params.thisAltTracker = $(`<div id="alt${params.characterName.replace(/[^a-zA-Z]/g, '')}"></div>`);

    Open_Thread_Wrapper.append(`<p>active <span class="ph-arrow-clockwise-bold"></span></p>`).on('click', 'p', RefreshParticipatedTracker(params));
    Alt_Thread_Wrapper.append(`<p>${params.altSectionTitle || "communications"}</p>`);
    Closed_Thread_Wrapper.append(`<p>archived</p>`);

    $(Open_Thread_Wrapper).append(params.thisTracker);
    $(Alt_Thread_Wrapper).append(params.thisAltTracker);

    $(Current_Script).before(`<center style="font-size: 90%;"> Tracker Code by <span class="ph-pencil-fill"></span> <a href="http://fizzyelf.jcink.net">FizzyElf</a> <span class="ph-paw-print-fill"></span></center>`);
}

function TrackParticipatedThreads(params = {}) {
    if (window.trackernum === undefined) window.trackernum = 0;
    else trackernum++;
    params.trackernum = trackernum;
    const Is_Mobile = (document.getElementById("mobile") !== null);
console.log("tracker num ", trackernum)

    const scriptelements = document.getElementsByTagName("script");
    const Current_Script = scriptelements[scriptelements.length - 1];

    if (!params) {
        params = {};
    }
    if (!params.indicators) {
        params.indicators = ['<span class="ph-check-bold"></span>', '<span class="ph-arrow-right-bold"></span>'];
    }
    if (!params.lockedMacroIdentifier) {
        params.lockedMacroIdentifier = "[title*=Closed],[class*=lock],[class*=closed]";
    }
    if (!params.altForumNames) {
        params.altForumNames = ["cellphones"];
    }
    if (!params.ignoreForumNames) {
        params.ignoreForumNames = ["completed", "math", "season 1", "season 2", "season 3", "season 4", "season 5", "season 6", "season 7", "season 8", "season 9", "season 10", "season 11", "season 12", "the bulletin", "clubs", "events", "subplots", "the utilities", "templates", "processing", "incomplete", "claims", "abstruse", "witch", "shifter", "werewolf", "fae", "merfolk", "vampire", "spirit", "mythical", "faculty", "townsfolk", "platonic", "family", "romance", "groups", "mixed", "ayo", "castle", "emily", "exodin", "ina", "io", "j", "joei", "nyorobon", "kismyth", "lili", "manda", "mina", "molly", "moth", "silv", "tolvagary", "turtle", "yuen", "mish", "old stuff", "dev challenges", "the darkest timeline", "eykta", "crystal", "time lapse", "online networks", "subgroups", "applications", "misc", "the archives", "year 1", "year 2", "year 3", "previous events", "6 months!", "general", "wonderland"];
    }
    if (!params.floodControl) {
        params.floodControl = 10;
    }

    loadJsFile('https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js', window.jQuery, function() {
        if (!params.characterName) {
            params.characterName = $(Current_Script).closest(".mobile-post, .post-normal").find("a[href*=showuser]").first().text().trim();
        }
        createTrackerElements(params, Current_Script);
        loadJsFile('https://files.jcink.net/uploads2/fizzyelf/sharedresources/autoTrackerMainProfile.js', window.FillTracker, function() {
            console.log(params.characterName, "tracker num ", params.trackernum,"timeout: ", params.floodControl * 1000 * params.trackernum )
            setTimeout(async () => {

                await FillTracker(params.characterName, params);
                if (Is_Mobile) $.get("/?act=mobile");
                if (params.thisAltTracker.text() != "None") params.thisAltTracker.parent().show();
                
            }, params.floodControl * 1000 * params.trackernum); 
            
        })
    });

}

function RefreshParticipatedTracker (params, Is_Mobile) {
    return function() {
        params.thisTracker.html('');
        params.thisAltTracker.html('');
        setTimeout(async () => {
            await FillTracker(params.characterName, params);
            if (Is_Mobile) $.get("/?act=mobile");
            if (params.thisAltTracker.text() != "None") params.thisAltTracker.parent().show();
            
        }, 0); 
    }
}

