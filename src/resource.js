
var s_Blood = "res/images/Bloodred.png";
var s_BloodBackground = "res/images/BloodBackground.png";
var s_Bullet = "res/images/Shell.png";
var s_HighBullet = "res/images/HighShell.png";
var s_AttackRange = "res/images/range.png";

var s_AttackEffect_mp3 = "res/Music/AttackEffect.mp3";
var s_AttackEffect_ogg = "res/Music/AttackEffect.ogg";
var s_AttackHighEffect_mp3 = "res/Music/AttackHighEffect.mp3";
var s_AttackHighEffect_ogg = "res/Music/AttackHighEffect.ogg";
var s_MonsterDie_mp3 = "res/Music/MonsterDie.mp3";
var s_MonsterDie_ogg = "res/Music/MonsterDie.ogg";
var s_MonsterAcross_mp3 = "res/Music/MonsterAcross.mp3";
var s_MonsterAcross_ogg = "res/Music/MonsterAcross.ogg";

var s_endGame_mp3 = "res/Music/gameOver.mp3";

var s_Creep = [
    "res/images/Creep.png",
    "res/images/Creep1.png",
    "res/images/Creep2.png"
];

var s_Disk = [
    "res/images/tower/disk.plist",
    "res/images/tower/disk.png",
];

var s_Android = [
    "res/images/android/android.plist",
    "res/images/android/android.png",
];

var s_Tower = [
    "res/images/Tower.png",
    "res/images/Tower.png"
];

var s_TowerBall = [
    "res/images/Tower-ball-1.png",
    "res/images/Tower-ball-2.png"
];

var s_CombWall = [
    "res/images/comb/comb.plist",
    "res/images/comb/comb.png",
];

var s_Wall = "res/images/mc.png";

var s_Selector = "res/images/Selector.png";


var g_resources = [
    //image

    {src:s_Blood},
    {src:s_BloodBackground},
    {src:s_Bullet},
    {src:s_HighBullet},
    {src:s_AttackRange},

    {src:s_Creep[0]},
    {src:s_Creep[1]},
    {src:s_Creep[2]},

    {src:s_Disk[0]},
    {src:s_Disk[1]},

    {src:s_Android[0]},
    {src:s_Android[1]},


    {src:s_CombWall[0]},
    {src:s_CombWall[1]},

    {src:s_Tower[0]},
    {src:s_Tower[1]},

    {src:s_TowerBall[0]},
    {src:s_TowerBall[1]},

    {src:s_Wall},

    {src:s_Selector},

    //effect
    {src:s_AttackEffect_mp3},
    {src:s_AttackEffect_ogg},
    {src:s_AttackHighEffect_mp3},
    {src:s_AttackHighEffect_ogg},
    {src:s_MonsterDie_mp3},
    {src:s_MonsterDie_ogg},
    {src:s_MonsterAcross_mp3},
    {src:s_MonsterAcross_ogg},

    //plist

    //fnt
    {fontName:"TR2N",
       src:[
                //{src:"res/fonts/Tr2n.eot", type:"embedded-opentype"},
                {src:"res/fonts/Tr2n.ttf",type:"truetype"}
       ]
    },
    {fontName:"Pirulen",
       src:[
                {src:"res/fonts/pirulen rg.ttf",type:"truetype"}
       ]
    },

    {fontName:"Imagine",
       src:[
                {src:"res/fonts/imagine_font.ttf",type:"truetype"}
       ]
    },

    //tmx

    //bgm
    {src:s_endGame_mp3},


];
