import React, { Component } from 'react';
import axios from 'axios';

class InterviewList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      interviews: [],
      participants: [],
    }
    // this.deleteExercise = this.deleteExercise.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:5000/participants')
      .then((res) => {
        console.log("res => ", res);
        this.setState({
          participants: res.data,
        })

        console.log("Updated STATE : ", this.state.participants);
      })
      .catch((error) => {
        console.log("Error : ", error);
      })


    axios.get('http://localhost:5000/interviews')
      .then((res) => {
        console.log("res => ", res);
        this.setState({
          interviews: res.data,
        })
        // console.log("Updated STATE : ", this.state.participants);
      })
      .catch((error) => {
        console.log("Error : ", error);
      })
  }


  render() {

    let participantMap = new Map();

    if (this.state.participants) {

      this.state.participants.forEach((part) => {
        participantMap.set(part.id, `${part.name}(${part.email})`)
      })

      for (let [key, value] of participantMap) {
        console.log(key + ' =>  ' + value)
      }
    }

    return (
      <div className="bg-light" style={{
        minHeight: "100vh"
      }}>
        <h5 style={{ textAlign: "center" }}>Upcoming Interviews</h5>
        <div className="container">
          {this.state.interviews.map((itr) => {

            return (
              <div className="card" style={{ marginBottom: 2, marginTop: 2 }}>
                <h4>Interview @ {itr.date} </h4>
                <p>from {itr.startTime} to {itr.endTime}</p>
                <p>Participant : {participantMap.get(itr.participantId)}</p>
              </div>
            )

          })}
        </div>
      </div>
    )
  }
}

export default InterviewList;