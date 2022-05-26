import React, {Component} from "react";


class Airdrop extends Component{
    
    // Airdrop to have a timer that counts down
    // initialize countdown after customers have staked a certain amount ... 50
    // timer functionality, countdown, startTimer, state - for time to work...


    // 1. Step
    constructor(){
        super();
        this.state = { time: {}, seconds: 20};
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    // Start time functionallity
    startTimer(){
        if(this.timer == 0 && this.state.seconds > 0){
            this.timer = setInterval(this.countDown, 1000)
            //console.log(this.timer) 
        }


    }



    // Countdown function
    countDown(){

        // 1. Every call needs to reduce the current time for 1
        let seconds = this.state.seconds - 1;
            // update the time
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds
        })    

        // 2. if the seconds hit 0  clear Interval
        if(seconds == 0){
            clearInterval(this.timer);
            // console.log(this.timer) 
        }

    }


    // 2. Create function that takes the number of seconds and make an object with , hours, minutes, seconds property, and returns it
    secondsToTime(secs){

    
        let hours, minutes, seconds;

        // Hours
        hours = Math.floor(secs / (60 * 60));
        
        // Minutes
        let devisor_for_minutes = secs % (60 * 60);
        minutes = Math.floor(devisor_for_minutes / 60);

        // Seconds
        let devisor_for_seconds = devisor_for_minutes % 60;
        seconds = Math.ceil(devisor_for_seconds);


        // Making an object and returning
        let obj = {

            'h': hours,
            'm': minutes,
            's': seconds
        }

        return obj;
    }

    //3. 
    // We want to set the time in state.time variable, we want to update it with secondsToTime function that returns and object, after  componentDidmount function
    // componentWillMount funtion is called before the page is loaded
    // componentDidMount function is called after the page is loaded
    // then after that we want to show that time in render function
    componentDidMount(){
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({time: timeLeftVar});
    }

    // Function for stake rewards when stake balance get over 50?? or someth.

    airdropReleaseTokens(){
        if(this.props.stakingBalance >= '50000000000000000000'){
            this.startTimer();
        }

    }


    render(){
        this.airdropReleaseTokens()

        return(
            <div style={{color: 'black'}}>
               {this.state.time.m} : {this.state.time.s}
               
            </div>
        )
    }

}
export default Airdrop;