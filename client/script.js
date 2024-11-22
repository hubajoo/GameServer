
let address;
let username = 'Anon';

document.addEventListener('DOMContentLoaded', async () => {
  const jsonResp = await fetch('data.json');
  const data = await jsonResp.json();
  address = data.ServerIp;
  console.log("address: ", address);
  console.log("version 3");
  const test = await fetch(`http://${address}/test`);
  const leaderboardElement = document.getElementById('leaderboard');
  leaderboardElement.textContent = address;

  const li = document.createElement('a');
  li.textContent = `${entry.name}: ${entry.score}`;
  leaderboardElement.appendChild(ltesti);

  const response = await fetch(`http://${address}/api/leaderboard`);
  const leaderboard = await response.json();

  leaderboard.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardElement.appendChild(li);
  });

});

document.getElementById('downloadBtn').addEventListener('click', async () => {
  const response = await fetch(`http://${address}/Game:${username}`);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'game.zip';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
});

document.getElementById('username').addEventListener('change', (event) => {
  const username = event.target.value;
  console.log('Changed username:', username);
});
