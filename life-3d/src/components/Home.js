import React from "react";
import { Link } from 'react-router-dom';

class Home extends React.Component {
    render() {
        return(
            <React.Fragment>
                <h1>
                    Exploring Cellular Automata in 3d
                </h1>

                <div className = "text-box"> 
                    <p className = "body-text" style = {{top: '25%'}}>
                        Over the course of two weeks I worked on simulating cellular automata in 3D using React and ThreeJS. I started out by 
                        first understanding CA in 2d by implementing Game of Life in 2D. The executable file and the source code can be found 
                        at github.  I wanted to create a simple interactive platform that would allow users to observe a 3D simulation of various 
                        CA rulesets. The web-app allows users to interact with two variations of Game of Life in 3D and I'll be working 
                        on adding more options in the future.
                    </p>
                </div>

                <div id="btn-container"> <Link to="/world" id="btn">View Project</Link> </div>
                
                <div id = "card-wrap"> 
                
                    <div id = "card-ctn">
                    
                        <div className = "card">
                            <h4 className = "card-cptn">What is Cellular Automata?</h4>
                            
                            <p className = "card-body">
                                A cellular automaton is a collection of "colored" cells on a grid of specified shape and dimension
                                that evolves through a number of discrete time steps according 
                                to a set of rules based on the states of neighboring cells. 
                                The number of distinct states a cell may assume must be specified.
                                The concept was originally discovered in the 1940s by Stanislaw Ulam and John von Neumann.
                                Cellular automata finds application in modelling systems, cryptography and in computation.
                            </p>

                            <a className = "link" target="_blank" href="https://mathworld.wolfram.com/CellularAutomaton.html">Read More</a>

                        </div>

                        <div className = "card" >
                            <h4 className = "card-cptn">... and what is Game Of Life?</h4>
                            
                            <p className = "card-body">
                                The Game of Life is a 2D cellular automaton devised by the British mathematician John Conway in 1970. 
                                It is a zero-player game - its evolution is determined by its initial state and needs no further input.
                                It is run by placing a number of filled (on) cells on a 2D grid. The cells can be either on or off.
                                We can interact with it by creating an initial configuration and observing how it evolves. 
                                It is Turing complete and can simulate a universal constructor or any other Turing machine.
                            </p>
                            
                            <a className = "link" target="_blank" href="https://mathworld.wolfram.com/GameofLife.html">Read More</a>

                        </div>
                    </div>
                </div>

                <footer>Done by Abirami Sankar</footer>
            </React.Fragment>
        );
    }
}

export default Home;