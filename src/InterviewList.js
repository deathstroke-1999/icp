import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class InterviewList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      interviews: [],
      participants: [],
      distinctSchedules: []
    }
  }

  componentDidMount() {
    axios.get('http://localhost:5000/distinctschedules')
      .then((res) => {
        console.log("res => ", res);
        this.setState({
          distinctSchedules: res.data,
        })

        console.log("Updated STATE : ", this.state.participants);
      })
      .catch((error) => {
        console.log("Error : ", error);
      })


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
      })
      .catch((error) => {
        console.log("Error : ", error);
      })
  }


  render() {

    // Create Particpant Map
    let participantMap = new Map();
    if (this.state.participants) {
      this.state.participants.forEach((part) => {
        participantMap.set(part.id, `${part.name}(${part.email})`)
      })
      // for (let [key, value] of participantMap) {
      //   console.log(key + ' =>  ' + value)
      // }
    }

    // console.log("distinctSchedules -> ", this.state.distinctSchedules);
    // console.log("interviews -> ", this.state.interviews);

    let finalScehule = this.state.distinctSchedules.map((ds) => {
      let tempRes = this.state.interviews.filter(itr => (
        (ds.date == itr.date) &&
        (ds.startTime == itr.startTime) &&
        (ds.endTime == itr.endTime)));

      let midResult = tempRes.map((tr) => tr.participantId);
      return {
        date: ds.date,
        startTime: ds.startTime,
        endTime: ds.endTime,
        participants: midResult
      }
    })

    console.log("finalScehule : ", finalScehule);


    return (
      <div className="bg-light" style={{
        minHeight: "100vh"
      }}>
        <h5 style={{ textAlign: "center" }}>Upcoming Interviews</h5>
        <div className="container">
          {finalScehule.map((itr) => {

            return (
              <div className="card" style={{ marginBottom: 4, marginTop: 4, padding: 2 }}>
                <h4>{itr.date} </h4>
                <p>from {itr.startTime} to {itr.endTime}</p>
                <p>Participants</p>
                <ul className="list-group">
                  {itr.participants.map((oneP) => (
                    <li className="list-group-item">{participantMap.get(oneP)}</li>
                  ))}
                </ul>
                <Link
                  to={{
                    pathname: '/edit',
                    state: {
                      pids: itr.participants,
                      pdate: itr.date,
                      pstarttme: itr.startTime,
                      pendtime: itr.endTime
                    }
                  }}>
                  > Edit Interview</Link>
              </div>
            )

          })}
        </div>
      </div >
    )
  }
}

export default InterviewList;