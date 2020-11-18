import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';

import "react-datepicker/dist/react-datepicker.css";

const Checkbox = ({ type = 'checkbox', name, checked = false, onChange }) => (
  <input type={type} name={name} checked={checked} onChange={onChange} />
);

const Error = ({ message }) => (
  <div className="alert alert-danger" role="alert">
    OOPS! {message}
  </div>
)

class EditInterview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
      startTime: '',
      endTime: '',
      participants: [],
      checkedItems: new Map(),
      pids: [],
      error: false,
      errorMsg: "",
      prev_date: new Date(),
      prev_startTime: '',
      prev_endTime: '',
    }

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
  }

  componentDidMount() {
    let { pids,
      pdate,
      pstarttme,
      pendtime,
    } = this.props.location.state;

    // console.log("PROPS DATA : ", pids, pdate, pstarttme, pendtime)

    axios.get('http://localhost:5000/participants')
      .then((res) => {
        console.log("res => ", res);

        let tempMap = new Map();
        let participants = res.data;
        participants.forEach(element => {
          if (pids.includes(element.id)) {
            tempMap.set(element.email, true)
          }
        });

        this.setState({
          participants: res.data,
          date: new Date(pdate),
          startTime: pstarttme,
          endTime: pendtime,
          pids: pids,
          checkedItems: tempMap,
          prev_date: new Date(pdate),
          prev_startTime: pstarttme,
          prev_endTime: pendtime,
        })
        console.log("Updated STATE : ", this.state);
      })
      .catch((error) => {
        console.log("Error : ", error);
      })
  }

  componentDidUpdate() {
    console.log("State Updated: ", this.state);
  }

  handleFormSubmit(event) {
    event.preventDefault();

    let lisOfparticipants = this.state.participants.filter(one => this.state.checkedItems.get(one.email))
    console.log("lisOfparticipants : ", lisOfparticipants);

    const newInterview = {
      date: this.state.date,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      participants: lisOfparticipants,
      prev_date: this.state.prev_date,
      prev_startTime: this.state.prev_startTime,
      prev_endTime: this.state.prev_endTime,
      prev_participantsList: this.state.pids
    }

    console.log("New Exercise => ", newInterview);

    // making POST REQUEST to backend  
    axios.post('http://localhost:5000/edit', newInterview)
      .then((res) => {
        console.log("res => ", res);
        console.log(res.data);
        // window.location = '/';
      })
      .catch((error) => {
        let errorMsg = error.response.data.message;
        this.setState({
          error: true,
          errorMsg: errorMsg
        })
      })
  }

  handleDateChange(newDate) {
    this.setState({
      date: newDate,
    })
  }

  handleCheckBoxChange(e) {
    console.log("caleld");
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
  }

  handleStartTimeChange(event) {
    this.setState({
      startTime: event.target.value
    })
  }

  handleEndTimeChange(event) {
    this.setState({
      endTime: event.target.value
    })
  }

  render() {

    return (
      <div className="bg-light">
        <h3 style={{ textAlign: "center" }}>Edit Interview</h3>

        {this.state.error ?
          (<Error message={this.state.errorMsg} />) : (<></>)
        }

        <form onSubmit={this.handleFormSubmit}>

          <div className="form-group">
            <label>Select Participants : </label>

            {
              this.state.participants.map(user => (
                <div>
                  <label key={user.id}>
                    {user.name + "(" + user.email + ")"}
                    <Checkbox name={user.email} checked={this.state.checkedItems.get(user.email)} onChange={this.handleCheckBoxChange} />
                    <br></br>
                  </label>
                </div>
              ))
            }
          </div>

          < div className="form-group" >
            <label>Date: </label>
            <div>
              <DatePicker
                selected={this.state.date}
                onChange={this.handleDateChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label>Start Time</label>
              <input type="time" className="form-control" id="start_time" value={this.state.startTime}
                onChange={this.handleStartTimeChange} />

            </div>
            <div className="form-group col-md-6">
              <label >End Time</label>
              <input type="time" className="form-control" id="end_time" value={this.state.endTime}
                onChange={this.handleEndTimeChange} />
            </div>
          </div>

          <div className="form-group">
            <input type="submit" value="Save Details" className="btn btn-primary" />
          </div>
        </form>
      </div>
    )
  }
}

export default EditInterview;