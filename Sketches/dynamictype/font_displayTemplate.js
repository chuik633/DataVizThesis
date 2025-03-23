
let font;
const width = window.innerWidth
const height = window.innerHeight

//font variables
let letters = "hello world"
let fontSize = 60
let sampleFac = .8


function preload(){
    font = loadFont('./styles/inconsolata.otf')
}
function setup(){
    textFont(font)

    createCanvas(width, height);
    background("#EFEDEB")
    drawLogo()

}


function drawLogo(){
    //positioning
    fontSize = getResizedFontSize(letters, fontSize, width - 50)

    let textWidth = (letters.length)*fontSize
    let x = width/2 - textWidth/2
    let y = height - fontSize - 10  //center

    //getting the letter points
    for(const letter of letters){
        let letter_points = font.textToPoints(
            letter,
            x,
            y,
            fontSize,
            { sampleFactor:  sampleFac}
        )
        drawLetter(letter_points)
        x+=fontSize
    }
    

}

function drawLetter(points){
    fill('black')
    beginShape()
    for(const point of points){   
        vertex(point.x, point.y)
    }
    endShape()
}


/**
 * helper function to get resized font size
 */
function getResizedFontSize(inputText, currFontSize, max_size){
    const inputLetters = inputText.split("")
    let squishedFontSize = currFontSize
    // console.log(letters)

    // squeeze the width to fit
    
    while((inputLetters.length)*squishedFontSize > max_size){
        squishedFontSize -=1
    }
    sampleFac = map(squishedFontSize, 10, 100, .8, .3)
    return squishedFontSize


    
}