import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css'
import './index.css';


function Square(props) {
    return (
      <button className="square" style={props.color} onClick={props.onClick}>
        {props.value}
      </button>
    );
}

function Button(props){
    return (
      <button className="button" onClick={props.onClick}>
        {props.value}
      </button>
    );
}


class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      //scores : Array(2).fill(0),
      squares: Array(9).fill(null),
      xIsNext: true,
      squaresColor: Array(9).fill(null),
      movesCount: 0,
      winner: null,
      divStyle: {background: 'white'},
    };
    this.newMatch = this.newMatch.bind(this);
    this.turnTimeOut = this.turnTimeOut.bind(this);
    this.handleEvent = this.handleEvent.bind(this)
    this.turnTime = 10
    this.turnNumber = 0;
  }

  /*refreshScore(winner){
    const scores = this.state.scores.slice()
    if (winner === this.props.players.player1){
      scores[0]++;
    } else {
      scores[1]++;
    }
    this.setState({
      scores: scores,
    });
  }

  resetScore(){
    const scores = this.state.scores.slice()
    scores[0] = 0;
    scores[1] = 0;
    this.setState({
      scores: scores,
    });
  }*/

  handleClick(i) {
      const squares = this.state.squares.slice();
      if(this.state.winner || squares[i] != null)
        return
      const squaresColor = this.state.squaresColor.slice();
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      squaresColor[i] = this.state.xIsNext ? {background: 'red'} : {background: 'green'}
      const winner = calculateWinner(squares,this.props.players)
      if (winner !== null){
        this.props.refreshScore(winner)
      }
      this.turnNumber++;
      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
        squaresColor: squaresColor,
        movesCount: this.state.movesCount+1,
        winner: winner,
        divStyle: {background: 'white'},
      });
  }

  newMatch(){
    const squares = Array(9).fill(null)
    const squaresColor =  Array(9).fill(null)
    this.counter = 0;
    this.setState({
      squares: squares,
      xIsNext: true,
      squaresColor: squaresColor,
      movesCount: 0,
      winner: null,
      seconds: 10,
      divStyle: {background: 'white'},
    });

  }

  renderSquare(i) {
    return <Square
      value={this.state.squares[i]} color={this.state.squaresColor[i]} onClick={() => this.handleClick(i)} />;
  }

  turnTimeOut(){
    if (this.state.xIsNext){
        this.props.refreshScore(this.props.players.player2)
    } else {
        this.props.refreshScore(this.props.players.player1)
    }
    this.turnNumber++
    this.newMatch();
  }

  handleEvent(seconds){
    if (seconds < this.turnTime/2 && seconds > this.turnTime/4){
      this.setState({
        divStyle: {background: 'orange'},
      });
      console.log('entrou')
    } else if (seconds < this.turnTime/4) {
      this.setState({
        divStyle: {background: 'red'},
      });
    }


  }

  render() {
    console.log(this.turnNumber)
    const winner = this.state.winner;
    let status;
    let restart = false;
    if (winner) {
      status = 'Winner: ' + winner;
      restart = true;
    } else if (this.state.movesCount !== 9) {
      status = 'Next player: ' + (this.state.xIsNext ? this.props.players.player1 : this.props.players.player2);
    } else {
      status = 'A tie!';
      restart = true;
    }
    return (
      <div style={this.state.divStyle}>
        <div className="status">{status}</div>
        <div>
          {restart ? (
            <div>
              <p>The match will restart in <Counter onZero={this.newMatch} startTime='10'/> seconds... </p>
              <a href="#" onClick={this.newMatch}>Restart now!</a>
            </div>
          ) : (
            <div>
              <p>Your turn will end in <Counter onZero={this.turnTimeOut} counterKey={this.turnNumber} onTick={this.handleEvent} startTime={this.turnTime}/> seconds... </p>
            </div>
          )}
        </div>
        <br />
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      scores : Array(2).fill(0),
      winner: null,
    };
    this.refreshScore = this.refreshScore.bind(this);
  }

  newGame(){
    this.props.handleNewGame()
  }

  refreshScore(winner){
    const scores = this.state.scores.slice()
    if (winner === this.props.players.player1){
      scores[0]++;
    } else {
      scores[1]++;
    }
    this.setState({
      scores: scores,
    });
  }

  resetScore(){
    const scores = this.state.scores.slice()
    scores[0] = 0;
    scores[1] = 0;
    this.setState({
      scores: scores,
    });
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Button value='Reset Game' onClick={() => this.newGame()}/>
          <Button value='Reset Statistics' onClick={() => this.resetScore()}/>
          <Board players={this.props.players} scores={this.state.scores} refreshScore={this.refreshScore}/>
          <div><p>{this.props.players.player1+' '+this.state.scores[0]+' vs '+this.state.scores[1]+' '+this.props.players.player2}</p></div>
        </div>
        <div className="game-info">
          <div></div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

class Counter extends React.Component {
  constructor(props) {
    super();
    this.state = {
      seconds: props.startTime
    };

    this.counter = null

    this.countDown = this.countDown.bind(this)
  }

  createCounter() {
    console.log(this.props.counterKey)
    this.counter = setInterval(this.countDown, 1000)
  }

  clearCounter() {
    if (!this.counter) {
      return
    }
    clearInterval(this.counter);
    this.counter = null
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      seconds: seconds,
    });
    if (this.props.onTick)
      this.props.onTick(seconds)
    if (seconds <= 0) {
      this.clearCounter()
      this.props.onZero();
    }
  }


  componentWillReceiveProps(nextProps){
    if (this.props.counterKey !== nextProps.counterKey) {
      this.clearCounter()
      this.setState({
        seconds: this.props.startTime
      })
      this.createCounter()
    }
  }

  componentWillMount(){
    this.createCounter()
  }

  componentWillUnmount() {
    this.clearCounter()
  }

  render(){
    return(
      <span>
        {this.state.seconds}
      </span>
    );
  }
}

class StartForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {player1: '', player2: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });

  }

  handleClick(event){
    const players = setPlayers(this.state.player1, this.state.player2)
    this.props._handleStartFormSubmit(players) //O método handleClick chama o handle passado em props?
    event.preventDefault();
  }

  render() {
    return(
      <div>
        <form onSubmit={this.handleClick}>
          <label>Player 1</label>
          <input name="player1" type="text" value={this.state.player1} onChange={this.handleChange} />
          <br/>
          <label>Player 2</label>
          <input name="player2" type="text" value={this.state.player2} onChange={this.handleChange} />
          <br/>
          <input type="submit" />
        </form>
      </div>
      )
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      players : '',
      started : false
    };
  }

  _handleStartFormSubmit(players) {
    //console.log(players)
    this.setState({
      players: players,
      started : !this.state.started,
    });
  }

  handleNewGame(){
    this.setState({
      started : !this.state.started,
    });
  }

  render() {
    return(
      <div>
        {this.state.started ? (
          <Game players={this.state.players} handleNewGame={() => this.handleNewGame()}/>
        ) : (
          <StartForm _handleStartFormSubmit={(players) => this._handleStartFormSubmit(players)} /> //Preciso passar parametros aqui? Suponho que o problema esteja aqui
        )}
      </div>
    )
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


function setPlayers(player1, player2){
  if(player1 !== null && player1 === player2) {
    player1 = player1 + ' (X)'
    player2 = player2 + ' (O)'
  }
  if (player1 === null || player1 === '')
    player1 = 'X'
  if (player2 === null || player2 === '')
    player2 = 'O'
    return {player1: player1, player2: player2}
}

function calculateWinner(squares, players) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];


  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      if(squares[a] === 'X')
        return players.player1;
      else
        return players.player2;
    }
  }
  return null;
}
