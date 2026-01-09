import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TestLogo from './assets/TestLogo.svg';
import HomeIcon from './assets/home_FILL0.svg';
import GroupIcon from './assets/group_FILL0.svg';
import CalendarIcon from './assets/calendar_FILL0.svg';
import ChatIcon from './assets/chat_bubble_FILL0.svg';
import CreditCardIcon from './assets/credit_card_FILL0.svg';
import DoctorProfile from './assets/doctor-profile.png';
import SettingsIcon from './assets/settings_FILL0.svg';
import MoreVertIcon from './assets/more_vert_FILL0.svg';
import RespiratoryIcon from './assets/respiratory rate.svg';
import TemperatureIcon from './assets/temperature.svg';
import HeartRateIcon from './assets/HeartBPM.svg';
import MoreHorizIcon from './assets/more_horiz_FILL0_wght300_GRAD0_opsz24.svg';
import DownloadIcon from './assets/download_FILL0_wght300_GRAD0_opsz24 (1).svg';

const GraphImage = 'https://images.squarespace-cdn.com/content/v1/64aa25ba0f9b2a46585e0148/1744317595465-36M6YOBMTRPM3M85YRLD/ChatGPT+Image+Apr+11%2C+2025%2C+01_38_05+AM.png';

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedDiagnosisIndex, setSelectedDiagnosisIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.age.toString().includes(searchQuery)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://fedskillstest.coalitiontechnologies.workers.dev',
          {
            auth: {
              username: 'coalition',
              password: 'skills-test'
            }
          }
        );
        setPatients(response.data);

        const jessicaTaylor = response.data.find(patient => patient.name === 'Jessica Taylor');
        setSelectedPatient(jessicaTaylor || response.data[0]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (error) {
    return <div className="App">Error: {error}</div>;
  }

  return (
    <div className="App">

      <nav className="navbar">
        <div className="navbar-left">
          <img src={TestLogo} alt="Tech.Care" className="navbar-logo" />
        </div>
        <div className="navbar-center">
          <button className="nav-button">
            <img src={HomeIcon} alt="Overview" className="nav-icon" />
            <span>Overview</span>
          </button>
          <button className="nav-button">
            <img src={GroupIcon} alt="Patients" className="nav-icon" />
            <span>Patients</span>
          </button>
          <button className="nav-button">
            <img src={CalendarIcon} alt="Schedule" className="nav-icon" />
            <span>Schedule</span>
          </button>
          <button className="nav-button">
            <img src={ChatIcon} alt="Message" className="nav-icon" />
            <span>Message</span>
          </button>
          <button className="nav-button">
            <img src={CreditCardIcon} alt="Transactions" className="nav-icon" />
            <span>Transactions</span>
          </button>
        </div>
        <div className="navbar-right">
          <div className="doctor-profile">
            <div className="doctor-info">
              <h4 className="doctor-name">Dr. Jose Simmons</h4>
              <p className="doctor-title">General Practitioner</p>
            </div>
            <img src={DoctorProfile} alt="Dr. Jose Simmons" className="doctor-photo" />
            <div className="navbar-icons">
              <img src={SettingsIcon} alt="Settings" className="navbar-icon" />
              <img src={MoreVertIcon} alt="More" className="navbar-icon" />
            </div>
          </div>
        </div>
      </nav>

      <div className="content-wrapper">
       
        <aside className="sidebar">
          
          <div className="patients-section">
          <div className="patients-header">
            <h2 className="patients-title">Patients</h2>
            <div className="search-container">
              <input 
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <svg className="search-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <select 
            className="patients-dropdown mobile-only"
            value={selectedPatient?.name || ''}
            onChange={(e) => {
              const patient = filteredPatients.find(p => p.name === e.target.value);
              if (patient) {
                setIsTransitioning(true);
                setTimeout(() => {
                  setSelectedPatient(patient);
                  setIsTransitioning(false);
                }, 300);
              }
            }}
          >
            {filteredPatients.map((patient) => (
              <option key={patient.name} value={patient.name}>
                {patient.name} - {patient.gender}, {patient.age}
              </option>
            ))}
          </select>
          {selectedPatient && (
            <div className="diagnosis-dropdown-wrapper mobile-only">
              <label htmlFor="diagnosis-select" className="diagnosis-dropdown-label">Diagnosis History:</label>
              <select 
                id="diagnosis-select"
                className="diagnosis-dropdown"
                value={selectedDiagnosisIndex}
                onChange={(e) => setSelectedDiagnosisIndex(Number(e.target.value))}
              >
                {selectedPatient.diagnosis_history?.map((history, index) => (
                  <option key={index} value={index}>
                    {history.month} {history.year}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="patients-list desktop-only">
            {filteredPatients.map((patient) => (
              <div
                key={patient.name}
                className="patient-card"
                onClick={() => {
                  if (selectedPatient?.name !== patient.name) {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setSelectedPatient(patient);
                      setIsTransitioning(false);
                    }, 300);
                  }
                }}
              >
                <img
                  src={patient.profile_picture}
                  alt={patient.name}
                  className="patient-photo"
                />
                <div className="patient-info">
                  <h3 className="patient-name">{patient.name}</h3>
                  <p className="patient-details">
                    {patient.gender}, {patient.age}
                  </p>
                </div>
                <img src={MoreHorizIcon} alt="More options" className="patient-more-icon" />
              </div>
            ))}
          </div>
        </div>
        {!isTransitioning && selectedPatient && (
          <div className="mobile-patient-section mobile-only">
            <div className="patient-profile-card">
              <div className="profile-image-container">
                <img src={selectedPatient.profile_picture} alt={selectedPatient.name} className="profile-image" />
              </div>
              <h2 className="profile-name">{selectedPatient.name}</h2>
              
              <div className="profile-details">
                <div className="detail-item">
                  <div className="detail-icon">📅</div>
                  <div className="detail-content">
                    <p className="detail-label">Date of Birth</p>
                    <p className="detail-value">{selectedPatient.date_of_birth}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">⚥</div>
                  <div className="detail-content">
                    <p className="detail-label">Gender</p>
                    <p className="detail-value">{selectedPatient.gender}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">📞</div>
                  <div className="detail-content">
                    <p className="detail-label">Contact Info</p>
                    <p className="detail-value">{selectedPatient.phone_number}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">🚨</div>
                  <div className="detail-content">
                    <p className="detail-label">Emergency Contacts</p>
                    <p className="detail-value">{selectedPatient.emergency_contact}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">🏥</div>
                  <div className="detail-content">
                    <p className="detail-label">Insurance Provider</p>
                    <p className="detail-value">{selectedPatient.insurance_type}</p>
                  </div>
                </div>
              </div>

            
              <div className="vital-signs-in-card">
                <div className="vital-card" style={{backgroundColor: '#E0F3FA'}}>
                  <img src={RespiratoryIcon} alt="Respiratory Rate" className="vital-icon" />
                  <div className="vital-info">
                    <p className="vital-label">Respiratory Rate</p>
                    <p className="vital-value">{selectedPatient.diagnosis_history[selectedDiagnosisIndex]?.respiratory_rate?.value} bpm</p>
                    <p className="vital-status">{selectedPatient.diagnosis_history[selectedDiagnosisIndex]?.respiratory_rate?.levels}</p>
                  </div>
                </div>

                <div className="vital-card" style={{backgroundColor: '#FFE6E9'}}>
                  <img src={TemperatureIcon} alt="Temperature" className="vital-icon" />
                  <div className="vital-info">
                    <p className="vital-label">Temperature</p>
                    <p className="vital-value">{selectedPatient.diagnosis_history[selectedDiagnosisIndex]?.temperature?.value}°F</p>
                    <p className="vital-status">{selectedPatient.diagnosis_history[selectedDiagnosisIndex]?.temperature?.levels}</p>
                  </div>
                </div>

                <div className="vital-card" style={{backgroundColor: '#FFE6F1'}}>
                  <img src={HeartRateIcon} alt="Heart Rate" className="vital-icon" />
                  <div className="vital-info">
                    <p className="vital-label">Heart Rate</p>
                    <p className="vital-value">{selectedPatient.diagnosis_history[selectedDiagnosisIndex]?.heart_rate?.value} bpm</p>
                    <p className="vital-status">{selectedPatient.diagnosis_history[selectedDiagnosisIndex]?.heart_rate?.levels}</p>
                  </div>
                </div>
              </div>

              <button className="show-all-btn">Show All Information</button>
            </div>

            <div className="lab-results-section">
              <h2 className="section-title">Lab Results</h2>
              <div className="lab-results-list">
                {selectedPatient.lab_results?.map((result, index) => (
                  <div key={index} className="lab-result-item">
                    <span className="lab-result-name">{result}</span>
                    <img src={DownloadIcon} alt="Download" className="lab-download-icon" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>

   
      <main className="main-content">
        {isTransitioning ? (
          <>
            <div className="skeleton skeleton-title"></div>
            <div className="diagnosis-history-section">
              <div className="skeleton skeleton-graph"></div>
              <div className="vital-signs-container">
                <div className="skeleton skeleton-vital-card"></div>
                <div className="skeleton skeleton-vital-card"></div>
                <div className="skeleton skeleton-vital-card"></div>
              </div>
            </div>
            <div className="diagnostic-list-section">
              <div className="skeleton skeleton-section-title"></div>
              <div className="skeleton skeleton-table"></div>
            </div>
          </>
        ) : selectedPatient && (
          <>
            <h1 className="main-title">Diagnosis History</h1>
            <div className="diagnosis-history-section">
              <div className="diagnosis-graph">
                <img src={GraphImage} alt="Blood Pressure Chart" className="graph-image" />
              </div>

             
              <div className="vital-signs-container mobile-only">
               
                <div className="vital-card" style={{backgroundColor: '#E0F3FA'}}>
                  <img src={RespiratoryIcon} alt="Respiratory Rate" className="vital-icon" />
                  <div className="vital-info">
                    <p className="vital-label">Respiratory Rate</p>
                    <p className="vital-value">{selectedPatient.diagnosis_history[selectedDiagnosisIndex]?.respiratory_rate?.value} bpm</p>
                    <p className="vital-status">{selectedPatient.diagnosis_history[selectedDiagnosisIndex]?.respiratory_rate?.levels}</p>
                  </div>
                </div>

             
                <div className="vital-card" style={{backgroundColor: '#FFE6E9'}}>
                  <img src={TemperatureIcon} alt="Temperature" className="vital-icon" />
                  <div className="vital-info">
                    <p className="vital-label">Temperature</p>
                    <p className="vital-value">{selectedPatient.diagnosis_history[selectedDiagnosisIndex]?.temperature?.value}°F</p>
                    <p className="vital-status">{selectedPatient.diagnosis_history[selectedDiagnosisIndex]?.temperature?.levels}</p>
                  </div>
                </div>

            
                <div className="vital-card" style={{backgroundColor: '#FFE6F1'}}>
                  <img src={HeartRateIcon} alt="Heart Rate" className="vital-icon" />
                  <div className="vital-info">
                    <p className="vital-label">Heart Rate</p>
                    <p className="vital-value">{selectedPatient.diagnosis_history[selectedDiagnosisIndex]?.heart_rate?.value} bpm</p>
                    <p className="vital-status">{selectedPatient.diagnosis_history[selectedDiagnosisIndex]?.heart_rate?.levels}</p>
                  </div>
                </div>
              </div>
            </div>

        
            <div className="diagnostic-list-section">
              <h2 className="section-title">Diagnostic List</h2>
              <div className="diagnostic-table">
                <table>
                  <thead>
                    <tr>
                      <th>Problem/Diagnosis</th>
                      <th>Description</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPatient.diagnostic_list?.map((diagnosis, index) => (
                      <tr key={index}>
                        <td>{diagnosis.name}</td>
                        <td>{diagnosis.description}</td>
                        <td>{diagnosis.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>


      {isTransitioning ? (
        <aside className="right-sidebar">
          <div className="patient-profile-card">
            <div className="skeleton skeleton-profile-image"></div>
            <div className="skeleton skeleton-profile-name"></div>
            <div className="profile-details">
              <div className="skeleton skeleton-detail-item"></div>
              <div className="skeleton skeleton-detail-item"></div>
              <div className="skeleton skeleton-detail-item"></div>
              <div className="skeleton skeleton-detail-item"></div>
              <div className="skeleton skeleton-detail-item"></div>
            </div>
            <div className="skeleton skeleton-button"></div>
          </div>
          <div className="lab-results-section">
            <div className="skeleton skeleton-section-title"></div>
            <div className="lab-results-list">
              <div className="skeleton skeleton-lab-item"></div>
              <div className="skeleton skeleton-lab-item"></div>
              <div className="skeleton skeleton-lab-item"></div>
            </div>
          </div>
        </aside>
      ) : selectedPatient && (
        <aside className="right-sidebar">
          <div className="patient-profile-card">
            <div className="profile-image-container">
              <img src={selectedPatient.profile_picture} alt={selectedPatient.name} className="profile-image" />
            </div>
            <h2 className="profile-name">{selectedPatient.name}</h2>
            
            <div className="profile-details">
              <div className="detail-item">
                <div className="detail-icon">📅</div>
                <div className="detail-content">
                  <p className="detail-label">Date of Birth</p>
                  <p className="detail-value">{selectedPatient.date_of_birth}</p>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">⚥</div>
                <div className="detail-content">
                  <p className="detail-label">Gender</p>
                  <p className="detail-value">{selectedPatient.gender}</p>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">📞</div>
                <div className="detail-content">
                  <p className="detail-label">Contact Info</p>
                  <p className="detail-value">{selectedPatient.phone_number}</p>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">🚨</div>
                <div className="detail-content">
                  <p className="detail-label">Emergency Contacts</p>
                  <p className="detail-value">{selectedPatient.emergency_contact}</p>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">🏥</div>
                <div className="detail-content">
                  <p className="detail-label">Insurance Provider</p>
                  <p className="detail-value">{selectedPatient.insurance_type}</p>
                </div>
              </div>
            </div>

            <button className="show-all-btn">Show All Information</button>
          </div>

        
          <div className="lab-results-section">
            <h2 className="section-title">Lab Results</h2>
            <div className="lab-results-list">
              {selectedPatient.lab_results?.map((result, index) => (
                <div key={index} className="lab-result-item">
                  <span className="lab-result-name">{result}</span>
                  <img src={DownloadIcon} alt="Download" className="lab-download-icon" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}
      </div>
    </div>
  );
}

export default App;

