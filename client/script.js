document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('http://localhost:8090/api/leaderboard');
  const leaderboard = await response.json();
  const leaderboardElement = document.getElementById('leaderboard');

  leaderboard.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardElement.appendChild(li);
  });
});