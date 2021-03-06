import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditStudentForm from './components/EditStudentForm';
import { fetchStudents, createStudent, deleteStudent } from './actions/studentActions';
import NewStudentForm from './NewStudentForm';
// import './App.css';
import './css/students.css';

class Students extends Component {

    state = {
        studentclicked: false,
        formClicked: false,
        id: '',
        showAllStudents: true,
        formSubmitted: false,
        needEditForm: false,
        name: "",
        grade: "",
        subject: "",
        school: "",
        hours: "",
        guardian: "",
        address: "",
        home_no: "",
        cell: "",
        email: "",

    }

    componentDidMount() {
        this.props.fetchStudents()
    }

    handleClick = (studentId) => {

        this.setState({
            showAllStudents: this.state.studentClicked,
            studentClicked: !this.state.studentClicked,
            id: studentId,

        })
        this.setState()
    }
    unclickNewStudentForm = () => {
        this.setState({ formSubmitted: false, formClicked: !this.state.formClicked, studentInfo: "" })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({
            formSubmitted: !this.state.submitted,
            formClicked: !this.state.clicked
        })

    }

    submitStraightForm = e => {
        e.preventDefault();
        this.props.createStudent(this.state)
        this.unclickNewStudentForm()
        this.setState({ showAllStudents: true })
    }
    handleSubmitForm = (e) => {
        e.preventDefault()

        const { name, grade, subject, school, hours, guardian, address, home_no, cell, email, home } = this.state

        const body = { name, grade, subject, school, hours, guardian, address, home_no, cell, email }
        this.props.createStudent(body)
        this.setState({
            formSubmitted: !this.state.submitted,
            formClicked: !this.state.clicked
        })
    }

    handleEdit = (stud) => {

        this.setState({ needEditForm: !this.state.needEditForm, formClicked: !this.state.needEditForm, studentClicked: !this.state.studentclicked, student: stud })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleDelete = (id) => {
        this.props.deleteStudent(id)
            .then(data => {
                this.unclickNewStudentForm()
                this.setState({ showAllStudents: true })

            })

    }

    theForm = () => {
        return (
            <>
                <h4>Enter New Student Info:</h4>
                <form className="quick-form-inputs" onSubmit={this.submitStraightForm}>
                    Name:<input type="text" name="name" onChange={this.handleChange} value={this.state.name} />
                    <br />

                    Grade:<input type="text" name="grade" onChange={this.handleChange} value={this.state.grade} />
                    <br />
                    Subject:<input type="text" name="subject" onChange={this.handleChange} value={this.state.subject} />
                    <br />
                    School:<input type="text" name="school" onChange={this.handleChange} value={this.state.school} />
                    <br />
                    Hours:<input type="text" name="hours" onChange={this.handleChange} value={this.state.hours} />
                    <br />
                    Guardian: <input name="guardian" onChange={this.handleChange} value={this.state.guardian} />
                    <br />
                    Address: <input name="address" onChange={this.handleChange} value={this.state.address} />
                    <br />
                    Home Phone:<input name="home_no" onChange={this.handleChange} value={this.state.home_no} />
                    <br />
                    Cell: <input name="cell" onChange={this.handleChange} value={this.state.cell} />
                    <br />
                    Email: <input name="email" onChange={this.handleChange} value={this.state.email} />
                    <br />
                    <input type="submit" />
                </form>
            </>
        )

    }
    studentQuickFormTextArea = () => {

        return (
            <div>

                <form className="quick-form" onSubmit={this.handleSubmit}>
                    <textarea rows="10" cols="60" type="text" onChange={this.handleChange} name="studentInfo" value={this.state.studentInfo} className="quick-form-textarea" required > </textarea>
                    <br /><button >Submit</button>
                </form>

            </div>)

    }
    formatTime = (time) => {

        const rawTime = parseInt(time)
        if (rawTime > 7 && rawTime < 12) {
            return `${time}am `
        }
        else {
            if (time[0] == 0) {
                return `${time.slice(1)}pm `
            }
            else if (rawTime % 12 === 0) {
                return `12:${time.split(":")[1]}pm`
            }
            else {
                time = `${parseInt(time) % 12}:${time.split(":")[1]}pm`
                return time
            }
        }

    }

    formatDate = (date) => {

        const rawDate = date.split("-")
        return `${rawDate[1]}/${rawDate[2]}/${rawDate[0]}`
    }

    hasSession = (student) => {
        if (student.sessions.length > 0) {
            student.sessions.map(sess => {

                const time = sess.date.replace(/-/g, "/").slice(11, 16)
                const date = sess.date.replace(/-/g, "/").split("T")[0]
                const timeInt = parseInt(time)
                const garbage = <li>`Date:${date} Time:${time}`</li>
                return garbage
            })
        }

    }
    sessionsIds = () => {
        return this.props.students.sessions.map(sess => sess.id)
    }
    instructor = (sessionId) => {
        const session = this.props.sessions.find(sess => sess.id === sessionId)
        const instructor = this.props.instructors.find(inst => inst.id === session.instructor_id).name
        return instructor


    }

    singleStudentInfo = (id) => {

        const theStudent = this.props.students.find(stu => stu.id === id)

        return (<div className="single-student-card">
            <p onClick={() => this.handleClick(theStudent.id)}><strong>{theStudent.name}</strong></p>
            <ul className="student-ul">
                <li><strong>Grade</strong>: {theStudent.grade}th</li>

                <li><strong>Guardian:</strong> {theStudent.guardian}</li>
                <li><strong>School:</strong> {theStudent.school}</li>
                <li style={{ color: "green" }}><strong>Subject:</strong> {theStudent.subject.toUpperCase()}</li>

                {/* {this.hasSession(theStudent)} */}
                {theStudent.sessions.length > 0 ? theStudent.sessions.map(sess => (<><li><strong> sessions:</strong> {sess.subject} </li><li><strong>Date:</strong> {this.formatDate(sess.date.split("T")[0])}</li><li><strong>Time:</strong> {this.formatTime(sess.time.split("T")[1].slice(0, 5))}</li><li><strong>Instructor:</strong>{this.instructor(sess.id)}</li></>))
                    : <li style={{ color: "red" }}>{`*${theStudent.name.split(" ")[0]} has no sessions booked`}</li>}
            </ul>
            {!this.state.needEditForm && <button onClick={() => this.handleEdit(theStudent)}>Edit Student</button>}
            {!this.state.needEditForm && <button onClick={() => this.handleDelete(theStudent.id)}>Delete Student</button>}
        </div>)
    }
    addNewStudentForm = () => {
        this.setState({ formClicked: !this.state.formClicked, showAllStudents: !this.state.showAllStudents })
    }
    back2OneStudent = () => {
        this.setState({
            formClicked: false, needEditForm: false, studentClicked: true
        })
    }
    back2All = () => {
        this.setState({
            formClicked: false, needEditForm: false, studentClicked: false, showAllStudents: true
        })
    }

    render() {

        const { showAllStudents, formClicked, studentClicked, needEditForm, formSubmitted } = this.state
        const students = this.props.students.map(stu => {

            return stu.sessions && <> <p onClick={() => this.handleClick(stu.id)} className="students"><strong>{stu.sessions.length > 0 ? `  ✅ ` : "❗️ "}</strong>{stu.name} </p></>
        })
        return (

            <div className={this.state.studentclicked ? "students-blur" : "students"} >
                {!formClicked && <h6 id="click-student-for-details">click Student to see details</h6>}
                {!formClicked && !studentClicked && <button onClick={this.addNewStudentForm}>Add Student</button>}
                {showAllStudents && students}
                {formClicked && !this.state.needEditForm && this.theForm()}
                {formClicked && !this.state.needEditForm && <h3 className="student-info-header"><strong>Copy & Paste </strong></h3>}
                {formClicked && !this.state.needEditForm && this.studentQuickFormTextArea()}
                {studentClicked && this.singleStudentInfo(this.state.id)}
                {needEditForm && <EditStudentForm student={this.state.student} back={this.back2All} />}
                {formSubmitted && <NewStudentForm newStuInfo={this.state.studentInfo} handleSubmit={this.handleSubmit} formUnclick={this.unclickNewStudentForm} />}
                {formClicked && <button onClick={this.back2All} className="new-form-cancel-btn">Cancel</button>}


            </div>

        )
    }

}
const mapStateToProps = (state) => {
    return {
        students: state.students.students,
        sessions: state.sessions.sessions,
        instructors: state.instructors.instructors
    }
}
export default connect(mapStateToProps, { fetchStudents, createStudent, deleteStudent })(Students)