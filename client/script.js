
document.addEventListener('DOMContentLoaded', async () => {
  const jsonResp = await fetch('data.json');
  const data = await jsonResp.json();
  let ip = data.ServerIp;
  console.log(ip);
  //ip = "http://127.0.0.1:8090";
  console.log(`http://${ip}:8090/api/leaderboard`);
  const response = await fetch(`http://${ip}/api/leaderboard`);

  const leaderboard = await response.json();
  const leaderboardElement = document.getElementById('leaderboard');

  //leaderboardElement.innerText = ip;

  leaderboard.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardElement.appendChild(li);
  });

});
document.getElementById('downloadBtn').addEventListener('click', async () => {
  const response = await fetch(`http://${ip}/Game:bob`);
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