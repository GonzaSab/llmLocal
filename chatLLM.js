const base_url = "http://localhost:1234/v1";
const api_key = "not-needed"; // Not needed for the local mock server

const postCompletion = async (messages) => {
  try {
    const response = await fetch(`${base_url}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      },
      body: JSON.stringify({
        model: "local-model", // This field is currently unused
        messages: messages,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) throw new Error('Failed to fetch');

    const completion = await response.json();
    const answer = completion.choices[0].message.content
    return answer;
  } catch (error) {
    console.error('ErrorGS:', error);
  }
};

module.exports = { postCompletion };


/* const chatLoop = async () => {
  while (true) {
    const completion = await postCompletion(history);

    if (completion && completion.choices && completion.choices[0] && completion.choices[0].delta && completion.choices[0].delta.content) {
      console.log(completion.choices[0].delta.content);
      history.push({ "role": "assistant", "content": completion.choices[0].delta.content });
    } else {
      console.log("No response or error in completion");
    }

    // To capture user input in Node.js, you might use readline or another npm package for asynchronous input.
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('> ', (input) => {
      history.push({ "role": "user", "content": input });
      readline.close();
      chatLoop(); // Call recursively to continue the loop
    });
  }
};

*/