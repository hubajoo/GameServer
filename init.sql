CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  score INT
);

-- Insert initial data
INSERT INTO leaderboard (name, score) VALUES ('Alice', 100);
INSERT INTO leaderboard (name, score) VALUES ('Bob', 200);
INSERT INTO leaderboard (name, score) VALUES ('Charlie', 150);