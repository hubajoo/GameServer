
let address;
let username = 'Anon';

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch the server IP address
  const jsonResp = await fetch('data.json');
  const data = await jsonResp.json();
  address = data.ServerIp;

  // Fetch the leaderboard data
  const leaderboardElement = document.getElementById('leaderboard');

  // Fetch the leaderboard data
  const response = await fetch(`http://${address}/api/leaderboard`);
  const leaderboard = await response.json();

  // Populate the leaderboard element
  leaderboard.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardElement.appendChild(li);
  });

});

// Add event listener to the submit button
document.getElementById('downloadBtn').addEventListener('click', async () => {
  // Fetch the game data
  const response = await fetch(`http://${address}/Game:${username}`);

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
