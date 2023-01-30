  //For Importing Images 

import bot from './assets/bot.svg';
import user from './assets/user.svg';

  // To Target HTML Elements Manually

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

  // Function To Load Our Messages
  // Every 300 Miliseconds We Have To Add . To .Element Textcontent
  // When Our Loading Indicator Has Reached 3 Dots We Have To Reset It 

function loader(element){
 element.textContent = '';  // To ensure it's empety at start

 loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....'){
      element.textContent ='';
    }
 },300) 
}

  // Function To Display Text In Continuos Way

function typeText(element,text){
  let index =0;

  let interval = setInterval(() => {
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  },20)
}

  // Function To generate Unique ID By Using Time,Date,Random Number And Hexadecimal String 
function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  
  return `id-${timestamp}-${hexadecimalString}`;
}

  // Function To Create ChatSripe For Front End Of Our And AI Conversation
function chatStripe  (isAi, value , uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class ="chat">
        <div class ="profile">
          <img 
            src ="${isAi ? bot :user}"
            alt ="${isAi ? 'bot':'user'}"
        />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
    `
    //Used Template String
    //We have rendered value in  ${value}
  )
}

  // Function To Trigger For Getting AI Generated Response
  // Used e.preventDefualt to prevent default behaviour of browser of reloading when submitting a form

const handleSumbit = async (e) =>{
e.preventDefault();

  //Get Data That We Type In Form

const data =new FormData(form);

  //User's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset(); // To Clear Input

  //Bot's chatstripe
  // Chatcontainer to scroll as we type the message

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ",uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // Fetch Data From Server -> Bot's Response 

  const response = await fetch('https://chatgpt-v5qt.onrender.com',{
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML ='';

    //This Gives Us Actual Response Recieved From Back-End
  if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv,parsedData);
} else {
   const err = await response.text();

   messageDiv.innerHTML = "Something went wrong";
   alert(err);
}

}

  // Hold values of submit
  // EventLister to user "ENTER" key to submit

form.addEventListener('submit', handleSumbit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSumbit(e);
  }
})


