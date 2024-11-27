# Huba's Game Server

![contributors-shield]
![forks-shield]
![stars-shield]
![issues-shield]
![license-shield]

<p align="center">
  <a href="https://github.com/hubajoo/GameServer">
     <img src="https://raw.githubusercontent.com/hubajoo/GameServer/main/Images/favicon.png" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">Huba's Game Server</h3>
  <p align="center">
    A server that track the leaderboard of game instances, provides a website for viewing it and downloading the game.
    <br />
    <a href="https://github.com/hubajoo/GameServer"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/hubajoo/GameServer">View Demo</a>
    ·
    <a href="https://github.com/hubajoo/GameServer/issues">Report Bug</a>
    ·
    <a href="https://github.com/hubajoo/GameServer/issues">Request Feature</a>
  </p>
</p>

## Table of Contents

- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## About The Project

![Product Name Screen Shot][product-screenshot]

 A server that track the leaderboard of game instances, provides a website for viewing it and downloading the game. 
 The server configures itself using the client requests and updates the game files, so games downloaded from it can coommunicate properly.


### Built With

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Docker
- Node.js
- npm

### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/hubajoo/GameServer.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add your database URL
   ```env
   DATABASE_URL=your_database_url
   ```
4. Build and run the Docker containers
   ```sh
   docker-compose up --build
   ```

## Usage

1. Deploy it as a container and direct traffic to it. 

2. Add your username to the username field.

3. Click the download button.

4. Unpack the downloaded game.zip file

5. Play the game and track your highscores in game or on the website.

## Testing

1. Install NPM packages
   ```sh
   npm install
   ```
1. Start the database
   ```sh
   docker-compose up --build db
   ```
2. Run included tests
   ```sh
   npm test
   ```


## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
   ```sh
   git fork https://github.com/hubajoo/GameServer.git
   ```
2. Create your Feature Branch
   ```sh
   git checkout -b feature/AmazingFeature
   ```
3. Commit your Changes
   ```sh
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the Branch
   ```sh
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Contact

Joó Huba - joohuba@gmail.com

Project Link: [https://github.com/hubajoo/GameServer](https://github.com/hubajoo/GameServer)

## Acknowledgements

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Font Awesome](https://fontawesome.com/)
- [GitHub Pages](https://pages.github.com/)
- [Markdown Guide](https://www.markdownguide.org/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/hubajoo/GameServer.svg?style=for-the-badge
[contributors-url]: https://github.com/hubajoo/GameServer/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/hubajoo/GameServer.svg?style=for-the-badge
[forks-url]: https://github.com/hubajoo/GameServer/network/members
[stars-shield]: https://img.shields.io/github/stars/hubajoo/GameServer.svg?style=for-the-badge
[stars-url]: https://github.com/hubajoo/GameServer/stargazers
[issues-shield]: https://img.shields.io/github/issues/hubajoo/GameServer.svg?style=for-the-badge
[issues-url]: https://github.com/hubajoo/GameServer/issues
[license-shield]: https://img.shields.io/github/license/hubajoo/GameServer.svg?style=for-the-badge
[license-url]: https://github.com/hubajoo/GameServer/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/huba-joó
[logo-url]: https://raw.githubusercontent.com/hubajoo/GameServer/main/Images/favicon.png
[product-screenshot]: https://raw.githubusercontent.com/hubajoo/GameServer/main/Images/screenshot.png