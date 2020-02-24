var defaultCharacters = [
    {
        id: 1,
        name: "Obi-Wan Kenobi",
        img: "https://vignette.wikia.nocookie.net/starwars/images/4/4e/ObiWanHS-SWE.jpg/revision/latest/top-crop/width/360/height/360?cb=20111115052816",
        attack: 8,
        attackIncrease: 8,
        cAttack: 14,
        health: 150
    },
    {
        id: 2,
        name: "Luke Skywalker",
        img: "https://vignette.wikia.nocookie.net/starwars/images/d/d9/Luke-rotjpromo.jpg/revision/latest/top-crop/width/360/height/450?cb=20091030151422",
        attack: 8,
        attackIncrease: 8,
        cAttack: 16,
        health: 150
    },
    {
        id: 3,
        name: "Darth Sidious",
        img: "https://vignette.wikia.nocookie.net/starwars/images/d/d8/Emperor_Sidious.png/revision/latest?cb=20130620100935",
        attack: 5,
        attackIncrease: 6,
        cAttack: 12,
        health: 165
    },
    {
        id: 4,
        name: "Darth Maul",
        img: "https://imgix.ranker.com/user_node_img/50085/1001691567/original/for-darth-maul-being-chopped-in-half-with-a-lightsaber-is-only-the-beginning-photo-u1?w=650&q=50&fm=pjpg&fit=crop&crop=faces",
        attack: 8,
        attackIncrease: 6,
        cAttack: 18,
        health: 145

    }
]

var selection = {};
var defender = {};
var currentDefenders;
var characters = [];

start();

function start(){
    characters = defaultCharacters.map(x => $.extend(true, {}, x));
    currentDefenders = [];
    $('.selection').empty();
    $('.current-defender').empty();
    $(".characters").removeClass("display");
    for(let char of characters){
        $(".characters").append($(`<div class="col-${Math.floor(12/characters.length)}"><img class="img-responsive char" src="${char.img}" alt="${char.name}" ><h4>${char.health}</h4></div>`));
    }
    $('.char').on('click', function(){
        characters.forEach((char, index) => {
            if($(this).attr("alt") == char.name){
                selection = char;
                
                $('.selection').append($(`<div class="col-4 offset-4"><img class="img-responsive char-selected" src="${char.img}" alt="${char.name}" ><div class="hp-selected" data-max="${char.health}" style="height: 5px; width: ${(char.health/char.health)*100 }%; background-color: green;"></div><h4>${char.health}</h4></div>`));
                $(".characters").addClass("display");
            }else{
                currentDefenders.push(char);
            }
        })
        
        $('.char').off();
        $('.characters').empty();
        renderDefenders();
        handleDefender();
        
    });    
}
//render the characters.

function attackHandler(){
    defender.health -= selection.attack;
    selection.attack += selection.attackIncrease;
    selection.health -= defender.cAttack;
    updateCharAndDefenderImages();
    //check if one of chars die.
    // debugger;
    $('.hp-selected').css({"width" : (selection.health/$('.hp-selected').data('max'))*100 + "%"});
    $('.hp-defender').css({"width" : (defender.health/$('.hp-defender').data('max'))*100 + "%"});
    if(currentDefenders.length == 0){
        const play = confirm('You have killed all the defenders! Congratulations! Play Again?') 
        if(play){
            start();
        }
        $('.attack-button').off();
    }else if(selection.health <= 0){
        const play = confirm('Unfortunately, you died! Nice try. Play again?')
        if(play){
            start();
            $('.attack-button').off();
        }
        
    }
    
    if(defender.health <= 0){
        // alert('Defender dead, new defender on the way.');
        $('.current-defender').empty();
        renderDefenders();
        handleDefender();
        $('.attack-button').off();
    }
    
}

function renderDefenders(){
    $('.defender-header').text('Defender Selection');
    $('.defenders').empty();
    currentDefenders.forEach(function(char, index){

        $('.defenders').append(`<div class="col-4"><img class="img-responsive char-defenders" src="${char.img}" alt="${char.name}" ><h4>${char.health}</h4></div>`);
        $('.defenders').removeClass('display');
    })
}
function handleDefender(){
    $('.char-defenders').on("click", function(){
        var currentThis = $(this);
        currentDefenders.forEach((char, index) => {
            if(currentThis.attr("alt") == char.name){
                defender = char;
                $('.current-defender').append(`<div class="col-4 offset-4"><img class="img-responsive char-defender" src="${char.img}" alt="${char.name}" ><div class="hp-defender" data-max="${char.health}" style="height: 5px; width: ${(char.health/char.health)*100 }%; background-color: green;"></div><h4>${char.health}</h4></div>`)
                currentDefenders.splice(index, 1);
                $('.attack-button').on('click', attackHandler);
                $('.defender-header').text('Current Defender');
                $('.defenders').addClass('display');

            }
            
        });
        $('char-defenders').off();
        $('.defenders').empty();
        
    })

}

function updateCharAndDefenderImages(){
    $('.current-defender h4').text(defender.health);
    $('.selection h4').text(selection.health);
}
