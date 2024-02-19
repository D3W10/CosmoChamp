<br />
<br />
<div align="center">
    <a href="https://github.com/D3W10/CosmoChamp">
        <img src="https://raw.githubusercontent.com/D3W10/CosmoChamp/main/svelte/static/logo.png" alt="Logo" width="60" height="60">
    </a>
    <br />
    <br />
    <h2 align="center">CosmoChamp</h2>
    <h3 align="center">Unleash the power of the cosmos elements!</h3>
    <br />
    <p align="center">
        <a href="https://github.com/D3W10/CosmoChamp/releases">Download App</a>
        ·
        <a href="https://github.com/D3W10/CosmoChamp/issues">Report Bug</a>
        ·
        <a href="https://github.com/D3W10/CosmoChamp/issues">Request Feature</a>
    </p>
</div>
<br />

### Table of Contents
1. [About](#about)
    - [Built With](#built-with)
2. [Getting Started](#getting-started)
    - [System Requirements](#system-requirements)
    - [Installation](#installation)
3. [Game Description](#game-description)
    - [Game Modes](#game-modes)
    - [Deck composition](#deck-composition)
4. [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation-1)
5. [License](#license)
6. [Credits](#credits)

<br />
<br />

## About

CosmoChamp is a luck based card game that can be played with friends in a local network environment. In order to play, both you and your friend need to download the game using the instructions below.

<br />

### Built With

- [TypeScript](https://www.typescriptlang.org/)
- [Electron](https://www.electronjs.org/)
- [SvelteKit](https://kit.svelte.dev/)
- [TailwindCSS](https://tailwindcss.com/)

<br />
<br />

## Getting Started

In order to play the game go to the [releases page](https://github.com/D3W10/CosmoChamp/releases) and download the latest version.

<br />

### System Requirements

To run the game you need:

- A computer running Windows or macOS:
    - Windows 10 or superior;
    - macOS 11.0 Big Sur or superior.
- At least 400 MB of free space.

<br />

### Installation

After downloading the setup from the [releases page](https://github.com/D3W10/CosmoChamp/releases), run it and follow the on screen instructions to get CosmoChamp on your device. Once installed, find it on your Start Menu or Launchpad and open it.

<br />
<br />

## Game Description

The game consists of 3 basic elements that cancel each other out, those elements are fire, water and snow.
The fire melts the snow, the snow freezes the water and the water extinguishes the fire.

Every element has 10 cards with different power levels, if both players use a card with the same element, the card with higher power wins.
If it happens that both you and your opponent end up with a card from the same element and equal power, it is considered a tie and neither player wins.

When the time starts ticking down select 1 of your 7 cards, you will have 15 seconds (5 on inferno mode) to do so.
After both players select a card, both will be revealed. The player who played the card that won will be awarded with a Cosmo Point.

Keep on winning rounds and stack as many points as you can.
In order to win, you must get the amount of Cosmo Points set on the goal.

During your game you will come across cards with special elements such as energy, wind, nature and space (only on normal mode).
Every time a round ends you have a 20% chance of getting one of these cards and you can use them along with a basic element when the time starts ticking.

The energy element allows you to reduce the power level of the opponent card by 3 levels.
For example, if the opponent played a snow 7 it will become a snow 4.

The wind element reverses the normal element cycle presentend on one of the rules before.
For example, if the opponent played a fire card and you played an ice card, you win.

The nature element switched the opponent card with a card of the same element you played, keeping the power level intact.
For example, if you played a water card and the opponent played a fire card, the opponent card will be replaced with a water card.

The space element has the power to give you 3 Cosmo Points if you manage to win the round, opposed to the traditional 1.

<br />

### Game Modes

- **Normal**: A normal CosmoChamp game that uses all the elements and cards available;
- **Vanilla**: A basic game based on normal where no special elements are present;
- **Inferno**: A harder and fast-paced version of the normal mode with no special cards.

<br />

### Deck composition

- Each element has 2 sets of cards from 1 to 9 plus one level 10 card;
- There's 3 main elements in the game (fire, water and snow);
- 5 cards for three of the special elements (energy, wind and nature), adding 2 more cards for the space element;
- The deck is composed by a total of 74 cards.

<br />
<br />

## Development

If you want to deploy a copy of CosmoChamp on your device to develop a feature or fix a bug, follow the steps below to get started.

<br />

### Prerequisites

In order to run the application, you will need the following tools:
- Node.JS (`20.0.0` or higher);
- npm (or equivalent);
- git (*optional*).

<br />

### Installation

1. Clone the repository
    ```sh
    git clone https://github.com/D3W10/CosmoChamp.git
    ```
2. Open the project folder using your prefered code editor (ex: VS Code)
3. Install the required dependencies on both the backend and frontend
    ```sh
    npm i
    cd svelte
    npm i
    ```
4. On the project root run either of the following commands to run the app
    ```sh
    npm run dev         # Run one instance
    npm run dev-multi   # Run two instances
    ```

<br />
<br />

## License

Distributed under the Mozilla Public License 2.0. Check `LICENSE` for more details.

<br />
<br />

## Credits

- Made by [D3W10](https://d3w10.netlify.app/)