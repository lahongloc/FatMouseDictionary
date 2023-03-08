var userPassage = document.querySelector('textarea.user_passage');
var textRewritten = document.querySelector('div.text_rewritten > div')
//console.log(textRewritten)

var options, stop, url, prompt


const sendButton = document.getElementById('btSubmit');
console.log(sendButton)
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
    
      const userMessage = 'Rewrite this passage longer and more formal: ' + userPassage.value;

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
          console.log(data);
          var aiMessage = data.choices[0].text;
          aiMessage =  aiMessage.substring(aiMessage.indexOf('\n\n'))
          textRewritten.innerHTML = '<p>' + aiMessage.slice(1) + '</p>'
        })
        .catch((error) => console.log(error),
        );
  }
})


// Lấy thẻ button và thẻ chứa văn bản cần sao chép
const copyBtn = document.querySelector('i.fa-paste')
// const textToCopy = document.querySelector("#text-to-copy");

// Thêm sự kiện click vào button
copyBtn.addEventListener("click", function() {
  // Lấy giá trị văn bản cần sao chép
  const text = textRewritten.textContent;

  // Tạo một thẻ input để sao chép văn bản vào clipboard
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  
  // Sao chép văn bản vào clipboard
  input.select();
  document.execCommand("copy");
  
  // Xóa thẻ input không cần thiết
  document.body.removeChild(input);
});

