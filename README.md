<div align="center">
  <a href="https://github.com/sweeeeetch/order-book">
    <img src="public/favicon.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Order Book</h3>

  <p align="center">
    Live order book. Test task for Vuejs developer
    <br />
    <a href="https://github.com/sweeeeetch/order-book"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://order-book-vue.netlify.app/">View Demo</a>
    ·
    <a href="https://github.com/sweeeeetch/order-book/issues">Report Bug</a>
    ·
    <a href="https://github.com/sweeeeetch/order-book/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

## About The Project

This is live Order book component for Vuejs. Although full logic is not located in one component, main part is written there.

This Vue.js application is a local order book that integrates with the Binance WebSocket API. It allows users to select a trading pair and retrieve real-time order book data and quotes for the chosen pair. The application fetches the list of available trading symbols from the Binance API on initialization and stores them in the Vuex store. Users can select a trading pair from a dropdown menu and click a button to fetch the order book data. The order book is displayed with separate sections for bids and asks, showing the price, quantity, and total in USD for each order.

The application utilizes WebSocket connections to receive live updates of the order book and the latest price for the selected trading pair. The current price is displayed along with an arrow indicating price movements, and the spread percentage is calculated and shown.

Also users can create their mock orders and look after them beeing moved based on price of pair.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- ![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
- ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
- ![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white) as SCSS
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

In order to start this project from local PC, you need to follow this steps below:

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/sweeeeetch/order-book.git
   ```
2. Install NPM packages in both client and server folders
   ```sh
   npm install
   ```
3. Run starting script and you are settled!
   ```sh
   npm run dev
   ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>
