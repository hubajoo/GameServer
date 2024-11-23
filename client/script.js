
let address;
let username = 'John Doe';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch the server IP address
    const jsonResp = await fetch('data.json');
    console.log("jsonResp.status", jsonResp.status);
    const data = await jsonResp.json();
    address = data.ServerIP;
    console.log('Server IP:', address);
  } catch (err) {
    console.error('Reading config data:', err);
  }

  // Get the leaderboard element
  const leaderboardElement = document.getElementById('leaderboard');

  let leaderboard;
  try {

    // Fetch the leaderboard data
    const response = await fetch(`http://${address}/api/leaderboard`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Parse the JSON response and store it in the leaderboard variable
    leaderboard = await response.json();

  } catch (err) {
    console.error('Error fetchin leaderboards:', err);
  }

  // Populate the leaderboard element
  leaderboard.forEach(entry => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardElement.appendChild(li);
  });

});

// Add event listener to the submit button
document.getElementById('downloadButton').addEventListener('click', async () => {

  // Fetch the game data
  const response = await fetch(`http://${address}/Game?username=${username}`);

  // Create a blob from the response
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  // Create a link element and click it
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'game.zip';
  document.body.appendChild(a);
  a.click();

  // Clean up
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
});

// Add event listener to the username input field
document.getElementById('username').addEventListener('change', (event) => {
  const username = event.target.value;
  console.log('Changed username:', username);
});
