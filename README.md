# ChineseChessAI
AI Agent for Chinese Chess - CS 221 Project

- Li Deng | 2016 Autumn 
- Stanford CS 221 Artificial Intelligence
<br> <br>

<div style="text-align: center">
<img src="https://raw.githubusercontent.com/dengl11/ChineseChessAI/master/public/resource/img/overview.png"  style="width: 700px;"/>
</div>

<br>

## Install
```bash
# clone
https://github.com/dengl11/ChineseChessAI.git 
cd ChineseChessAI 

# Install dependencies
npm install

# start server
npm start
```

--------------



<b><br>
## Display of Legal Moves
<div style="text-align: center">
<img src="https://raw.githubusercontent.com/dengl11/ChineseChessAI/master/public/resource/img/board-with-moves.png"  style="width: 400px;"/>
</div>

<br><br>
## Live Performance Analysis
<div style="text-align: center">
<img src="https://raw.githubusercontent.com/dengl11/ChineseChessAI/master/docs/resource/img/learn.png"  style="width: 700px;"/>
<img src="https://raw.githubusercontent.com/dengl11/ChineseChessAI/master/docs/resource/img/effenciency.png"  style="width: 700px;"/>
</div>

<br><br>
## Demo
<div style="text-align: center">
<img src="https://raw.githubusercontent.com/dengl11/ChineseChessAI/master/docs/resource/img/game.gif"  style="width: 600px;"/>
</div>
--------------


<br><br>
## Disclaimer
- **AI algofithms in the backend computation engine need to be enchanced (I was a bit hasty when then poster session was approaching >\_<)**
    - `MCTS` and `TDLearning` implementations are not solid
    - reinforcement learning part seldom works

<br>
- **Effienciency need to be imporved**
    - Current computation engine is in javascript, which is not fast enough (I did not know how to call other executables from nodeJS then..., but now I do, please see below)
    - You may implement a more powerful engine in C/C++ by calling a subprocess in server, [NodeJS Child Process](https://nodejs.org/api/child_process.html) should help



<br><br>
--------------
Thanks for your interest :)
<br><br>
