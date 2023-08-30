//Slider
const inputSlider = document.querySelector('.slider');
const passwordDisplay = document.querySelector('.display');
//Password Length
const lengthDisplay = document.querySelector('[data-lengthNumber]');

//Copy Button
const copytBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');

//Check Boxes
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');

//Strength Indicator
const indicator = document.querySelector('[strength-indicator]');

//To generate Password
const generateBtn = document.querySelector('.generatePassword');

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// Set Length of Password
function handleSlider(){
    inputSlider.value = passwordLength;   
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min))+"% 100%"
}

function setIndicator(indicatorValue){
        document.querySelector('.writeStrength').innerText = indicatorValue;
}

// Shuffle Password
function shufflePassword(array){

    // Fisher Yates Method for finding the random number
    for(let i=array.length-1 ; i > 0 ; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str="";
    for(let i=0 ; i<array.length ; i++){
        str = str + array[i];
    }
    return str;
}

// It gets a random integer between Minimum And Maximum Value
function getRandomInteger(min,max){
  return Math.floor( Math.random()*(max-min) ) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    let num = getRandomInteger(97,123);
   return String.fromCharCode(num);
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    let symbols = ['~','!','@','#','$','%','^','&','*','-','?','`','_','+','='];
    let index =  getRandomInteger(0,symbols.length);
    return symbols[index];
}

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol && passwordLength >=8 )){
        setIndicator('Perfect');
    }
    else if((hasLower||hasUpper)&&(hasNumber||hasSymbol)&&passwordLength>=6){
        setIndicator('Good');
    }
    else{
        setIndicator('Can Be Better');
    }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText  = "failed";
    }
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    })

    if(passwordLength < checkCount++ ){
        passwordLength = checkCount;
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange());
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

//copytBtn.addEventListener('click', ()=>{
  //  if(passwordDisplay.value)
   // copyContent();
//})

generateBtn.addEventListener('click', ()=>{

    // If none of the check box is selected then no password will be generated
    if( checkCount <= 0)
        return;
    
    if(passwordLength < checkCount ){
        passwordLength = checkCount;
        handleSlider();
    }

    // Now finding the new password
    password = "";

    // Pehle ham jo checkbox tick hai wo dal denge password mein and baki ke hamare hisaab se karenge
   /* if(uppercaseCheck.checked){
        password += generateUpperCase();
    }

    if(lowercaseCheck.checked){
        password += generateLowerCase();
    }

    if(numbersCheck.checked){
        password += generateRandomNumber();
    }

    if(symbolsCheck.checked){
        password += generateSymbol();
    }
    */

    let funcArr =[];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //Compulsory Addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    //Remaining Addition
    for(let i=0 ; i<passwordLength-funcArr.length ; i++){
        let randomIndex = getRandomInteger(0,funcArr.length);
        password += funcArr[randomIndex]();
    }
 //   document.getElementByClassName("display").style.fontSize = "1.5 rem";
    passwordDisplay.value = shufflePassword(password);
    calculateStrength();
})