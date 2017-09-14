# ChineseChessAI
AI Agent for Chinese Chess - CS 221 Project

- Li Deng | 2016 Autumn 
- Stanford CS 221 Artificial Intelligence

## Install
```bash
# Install dependencies
npm install

# start server
npm start
```

![alt tag](https://raw.githubusercontent.com/dengl11/ChineseChessAI/master/public/resource/img/overview.png)
--------------



## Display of Legal Moves
![alt tag](https://raw.githubusercontent.com/dengl11/ChineseChessAI/master/public/resource/img/board-with-moves.png)

## Live Performance Analysis
![alt tag](https://raw.githubusercontent.com/dengl11/ChineseChessAI/master/docs/resource/img/learn.png)
![alt tag](https://raw.githubusercontent.com/dengl11/ChineseChessAI/master/docs/resource/img/effenciency.png)

## Demo
![alt tag](https://raw.githubusercontent.com/dengl11/ChineseChessAI/master/docs/resource/img/game.gif)
--------------


## Disclaimer
- AI algofithms in the backend computation engine need to be enchanced (I was a bit hasty when then poster session was approaching >\_<)
    - `MCTS` and `TDLearning` implementations are not solid
    - reinforcement learning part seldom works

- Effienciency need to be imporved 
    - Current computation engine is in javascript, which is not fast enough (I did not know how to call other executables from nodeJS then..., but now I do, please see below)
    - You may implement a more powerful engine in C/C++ by calling a subprocess in server, [NodeJS Child Process](https://nodejs.org/api/child_process.html) should help
