var userPassage = document.querySelector('textarea.user_passage');
var textRewritten = document.querySelector('div.text_rewritten > div')


var options, stop, url, prompt


const sendButton = document.getElementById('btSubmit');
// console.log(sendButton)
const chatContainer = document.getElementById('chat-container');
const model = 'text-davinci-003';
const max_tokens = 500;

var apiKey = ''; // Your OpenAI API Key
sendButton.addEventListener('click', function() {
if(userPassage.value === '') {

} else {
  apiKey = document.querySelector('input.API_key').value
  stop = '';
  url = `https://api.openai.com/v1/completions`;
   prompt = [
    `You are a web chat bot inside of the website: https://example.com`,
    ``,
  `If users ask you for code, return any code in code format`,
  ].join('\n');

    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: [prompt],
        model,
        max_tokens,
        stop,
      }),
    };
    

  // function sendMessage() {
    const userMessage = 'Rewrite this passage or this sentence/question longer and more formal: ' + userPassage.value;
  
    // Send the user's message to the API
    options.body = JSON.stringify({
      prompt: prompt + userMessage,
      model,
      max_tokens,
      stop,
    });
  
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        var aiMessage = data.choices[0].text;
        aiMessage =  aiMessage.substring(aiMessage.indexOf('\n\n'))
        // var newStr = aiMessage.substring(index)
        // console.log(aiMessage)
  
       
        // textRewritten.innerHTML = '<p id = "hieu_ung_danh_chu">' + aiMessage.slice(1) + '</p>'

        document.getElementById("hieu_ung_danh_chu").innerHTML = ""
        var tocDo = 15;
        var i = 0;
        function typeWriter() {
          if (i < aiMessage.slice(1).length) {
            document.getElementById("hieu_ung_danh_chu").innerHTML += aiMessage.slice(1).charAt(i);
            i++;
            setTimeout(typeWriter, tocDo );
          }
        }
        typeWriter()
      })
      .catch((error) => console.log(error),
      );
}
})


// L???y th??? button v?? th??? ch???a v??n b???n c???n sao ch??p
const copyBtn = document.querySelector('i.fa-paste')
// const textToCopy = document.querySelector("#text-to-copy");

// Th??m s??? ki???n click v??o button
copyBtn.addEventListener("click", function() {
  // L???y gi?? tr??? v??n b???n c???n sao ch??p
  const text = textRewritten.textContent;

  // T???o m???t th??? input ????? sao ch??p v??n b???n v??o clipboard
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  
  // Sao ch??p v??n b???n v??o clipboard
  input.select();
  document.execCommand("copy");
  
  // X??a th??? input kh??ng c???n thi???t
  document.body.removeChild(input);
});

