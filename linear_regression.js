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
  
  async function performLinearRegression(y, x, apiKey) {
    if (y.length !== x.length) {
      alert("Error: # of elements in dependent + independent variables must be the same.");
      return;
    }
  
    const xWithConstant = x.map(val => [1, val]); // Add a constant term for the intercept
    const regressionModel = new ML.SimpleLinearRegression();
    regressionModel.fit(xWithConstant, y);
  
    const regressionResult = {
      slope: regressionModel.slope,
      intercept: regressionModel.intercept,
      rSquared: regressionModel.score(xWithConstant, y)
    };
  
    const summaryText = `Slope: ${regressionResult.slope}\nIntercept: ${regressionResult.intercept}\nR-squared: ${regressionResult.rSquared}`;
  
    const prompt = `Please interpret the following regression results:\n${summaryText}`;
    const interpretation = await fetchOpenAIResponse(prompt, apiKey);
  
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<h3>Regression Results:</h3><pre>${summaryText}</pre><h3>OpenAI API Interpretation:</h3><p>${interpretation}</p>`;
  }
  
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
  