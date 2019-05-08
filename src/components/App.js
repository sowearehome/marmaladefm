/*global Mixcloud*/
///FluidRadio/nuojuva-sunnuntai/
import React, {Component} from 'react';
import FeaturedMix from './FeaturedMix';
import Header from './Header.js';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './Home.js';
import Archive from './Archive.js';
import About from './About';
//import mixesData
import mixesData from '../data/mixes';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMix: '',
      mixIds: mixesData,
      playing: false,
      mix: null,
      mixes: []
    };
  }

  fetchMixes = async () => {
    const {mixIds} = this.state;
    console.log(mixIds);

    mixIds.map(async id => {
      try {
        const response = await fetch(`https://api.mixcloud.com${id}`);
        const data = await response.json();
        console.log(data);
        // putting mixes into state
        this.setState((prevState, props) => ({
          mixes: [...prevState.mixes, data]
        }));
      } catch (error) {}
    });
  };

  mountAudio = async () => {
    // when we use the this keyword, our widget is now accessible
    // anywhere inside the component
    this.widget = Mixcloud.PlayerWidget(this.player);
    // here we wait for our widget to be ready before continuing
    await this.widget.ready;

    // using the mixcloud widget events we can detect when our
    // audio has been paused, set playing state to false
    this.widget.events.pause.on(() =>
      this.setState({
        playing: false
      })
    );
    // audio is playing again, set playing state to true
    this.widget.events.play.on(() =>
      this.setState({
        playing: true
      })
    );
  };

  componentDidMount() {
    // when our app component is all loaded onto the page
    // our componentDidMount gets called and we can be sure
    // everything is ready, so we then run our mountAudio()
    // method
    this.mountAudio();
    this.fetchMixes();
  }

  actions = {
    // we group our methods together inside of an object
    // called actions
    togglePlay: () => {
      // we want to togglePlay() on our widget
      this.widget.togglePlay();
    },
    playMix: mixName => {
      // if  mixName === same as  currently
      // playing mix, pause it
      const {currentMix} = this.state;

      if (this.state.playing === false) {
        this.setState({playing: true});
        this.setState({
          currentMix: mixName
        });
      } else {
        this.setState({playing: false});
      }
      if (mixName === currentMix) {
        return this.widget.togglePlay();
      }
      // update currentMix with mixName
      this.setState({
        currentMix: mixName
      });

      // load a new mix by its name and then
      // start playing it immediately
      this.widget.load(mixName, true);
    }
  };

  render() {
    // const firstMix = this.state.mixes[0]
    //if array is empty, assign it a default value of an empty {} object
    const [firstMix = {}] = this.state.mixes;
    return (
      // router wraps whole page
      <Router>
        {/* this div contains everything */}
        <div>
          {/* this div contains page excl. audio player*/}
          <div className="flex-l justify-end">
            {/* featured mix needs styling*/}
            <FeaturedMix {...this.state} {...this.actions} {...firstMix} id={firstMix.key} />
            <div className="w-50-l relative z-1">
              {/* header needs styling */}
              <Header />
              {/* routed page */}
              {/* <div>
                <button onClick={this.togglePlay}>{this.state.playing ? 'Pause' : 'Play'}</button>
              </div> */}

              <Route exact path="/" render={() => <Home {...this.state} {...this.actions} />} />
              <Route path="/archive" render={() => <Archive {...this.state} {...this.actions} />} />
              <Route path="/about" render={() => <About {...this.state} />} />
            </div>
          </div>
          {/* audio player */}
          <iframe
            width="100%"
            height="60"
            src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2FMaryAnneHobbs%2Fapparat-xfm-mix-17092011%2F"
            frameBorder="0"
            title="audioplayer"
            className="player db fixed bottom-0 z-5"
            //to reference this iframe -> ref
            // allows to get actual html element inside react
            ref={player => (this.player = player)}
            allow="autoplay"
          />
        </div>
      </Router>
    );
  }
}

export default App;
