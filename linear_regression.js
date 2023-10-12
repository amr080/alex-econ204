// linear_regression.js

// Function to fetch OpenAI response
async function fetchOpenAIResponse(prompt, apiKey) {
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ prompt })
  });
  const data = await response.json();
  return data.text;
}

// Function to perform linear regression
async function performLinearRegression(y, x, apiKey) {
  const response = await fetch('/api/regression', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ y, x })
  });
  const data = await response.json();
  const summaryText = data.summary;

  const prompt = `Please interpret the following regression results:\n${summaryText}`;
  const interpretation = await fetchOpenAIResponse(prompt, apiKey);
  console.log(`OpenAI API Interpretation: ${interpretation}`);

  let userQuestion = prompt("Do you have any questions about the regression results? (type 'exit' to quit): ");
  while (userQuestion.toLowerCase() !== 'exit') {
    const prompt = `Based on the following regression results, ${userQuestion}:\n${summaryText}`;
    const answer = await fetchOpenAIResponse(prompt, apiKey);
    console.log(`OpenAI API Answer: ${answer}`);
    userQuestion = prompt("Do you have any questions about the regression results? (type 'exit' to quit): ");
  }
}

// Add an event listener to execute linear regression when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const yInput = document.getElementById('y-input');
  const xInput = document.getElementById('x-input');
  const apiKeyInput = document.getElementById('api-key-input');
  const submitButton = document.getElementById('submit-button');

  submitButton.addEventListener('click', () => {
    const y = yInput.value.split(',').map(Number);
    const x = xInput.value.split(',').map(Number);
    const apiKey = apiKeyInput.value;
    performLinearRegression(y, x, apiKey);
  });
});
