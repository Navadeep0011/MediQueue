
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [appointments, setAppointments] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("Dr. Ravi Kumar");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:8080/api/appointments";

  async function loadAppointments() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load appointments");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      setMessage("Cannot connect to backend. Check whether it is running.");
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function bookAppointment(event) {
    event.preventDefault();
    setMessage("");

    const appointment = {
      patientName,
      doctorName,
      appointmentDate,
      appointmentTime,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      setPatientName("");
      setAppointmentDate("");
      setAppointmentTime("");
      setMessage("Appointment booked successfully!");
      await loadAppointments();
    } catch (error) {
      setMessage("Booking failed. Please check the backend.");
    }
  }

  return (
    <div className="container">
      <h1>MediQueue</h1>
      <p>Hospital Appointment Booking System</p>

      <form onSubmit={bookAppointment}>
        <label>Patient Name</label>
        <input
          type="text"
          value={patientName}
          onChange={(event) => setPatientName(event.target.value)}
          placeholder="Enter patient name"
          required
        />

        <label>Choose Doctor</label>
        <select
          value={doctorName}
          onChange={(event) => setDoctorName(event.target.value)}
        >
          <option>Dr. Ravi Kumar</option>
          <option>Dr. Priya Sharma</option>
          <option>Dr. Arjun Reddy</option>
        </select>

        <label>Appointment Date</label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(event) => setAppointmentDate(event.target.value)}
          required
        />

        <label>Appointment Time</label>
        <input
          type="time"
          value={appointmentTime}
          onChange={(event) => setAppointmentTime(event.target.value)}
          required
        />

        <button type="submit">Book Appointment</button>
      </form>

      {message && <p>{message}</p>}

      <h2>Appointments</h2>

      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.id}</td>
              <td>{appointment.patientName}</td>
              <td>{appointment.doctorName}</td>
              <td>{appointment.appointmentDate}</td>
              <td>{appointment.appointmentTime}</td>
              <td>{appointment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
