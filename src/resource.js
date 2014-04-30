var s_menuBackground = "res/images/bg_menu.png";
var s_logo = "res/images/logo.png";


var s_Blood = "res/images/creep/Bloodred.png";
var s_BloodBackground = "res/images/creep/BloodBackground.png";
var s_Bullet = "res/images/Shell.png";
var s_HighBullet = "res/images/HighShell.png";
var s_AttackRange = "res/images/range.png";

var s_AttackEffect_mp3 = "res/Music/effect/AttackEffect.mp3";
var s_AttackHighEffect_mp3 = "res/Music/effect/AttackHighEffect.mp3";
var s_MonsterDie_mp3 = "res/Music/effect/MonsterDie.mp3";

var s_Battle1_mp3 = "res/Music/bgm/battle1.mp3";

var s_loadingScene_mp3 = "res/Music/bgm/loadingSound.mp3";
var s_endGame_mp3 = "res/Music/bgm/gameOver.mp3";

var s_Creep = [
    "res/images/creep/Creep.png",
    "res/images/creep/Creep1.png",
    "res/images/creep/Creep2.png",
    "res/images/creep/Creep3.png",
    "res/images/creep/Creep4.png",
    "res/images/creep/Creep5.png",
    "res/images/creep/Creep6.png",
    "res/images/creep/Creep7.png",
    "res/images/creep/Creep8.png",
    "res/images/creep/Creep9.png",
    "res/images/creep/Creep10.png",
    "res/images/creep/jl.png",
];

var s_Disk = [
    "res/images/tower/disk.plist",
    "res/images/tower/disk.png",
];

var s_Android = [
    "res/images/android/android.plist",
    "res/images/android/android.png",
];

var s_TowerBall = [
    "res/images/Tower-ball-1.png",
    "res/images/Tower-ball-2.png"
];

var s_CombWall = [
    "res/images/comb/comb.plist",
    "res/images/comb/comb.png",
];

var s_Wall = "res/images/wall.png";

var s_Selector = "res/images/Selector.png";

var s_gameOver = "res/images/gameOver.png";


var g_resources = [
    //image

    {src:s_menuBackground},
    {src:s_logo},

    {src:s_Blood},
    {src:s_BloodBackground},
    {src:s_Bullet},
    {src:s_HighBullet},
    {src:s_AttackRange},

    {src:s_Creep[0]},
    {src:s_Creep[1]},
    {src:s_Creep[2]},
    {src:s_Creep[3]},

    {src:s_Disk[0]},
    {src:s_Disk[1]},

    {src:s_Android[0]},
    {src:s_Android[1]},


    {src:s_CombWall[0]},
    {src:s_CombWall[1]},


    {src:s_TowerBall[0]},
    {src:s_TowerBall[1]},

    {src:s_Wall},

    {src:s_Selector},
    {src:s_gameOver},

    //effect
    {src:s_AttackEffect_mp3},
    {src:s_AttackHighEffect_mp3},
    {src:s_MonsterDie_mp3},


    //plist

    //fnt
    {fontName:"TR2N",
       src:[
                //{src:"res/fonts/Tr2n.eot", type:"embedded-opentype"},
                {src:"res/fonts/Tr2n.ttf",type:"truetype"}
       ]
    },
    {fontName:"GoodTimes",
       src:[
                {src:"res/fonts/GoodTimes.ttf",type:"truetype"}
       ]
    },

    {fontName:"N-Gage",
       src:[
                {src:"res/fonts/N-Gage.ttf",type:"truetype"}
       ]
    },

    {fontName:"Imagine",
       src:[
                {src:"res/fonts/imagine_font.ttf",type:"truetype"}
       ]
    },

    //tmx

    //bgm
    {src:s_loadingScene_mp3},
    {src:s_endGame_mp3},
    {src:s_Battle1_mp3},


];
