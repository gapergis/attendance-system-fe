// LecturePage.js
import React, { useState, useEffect } from 'react';
import { getLectures } from '../../services/lectureService';
import LectureCreationForm from '../../components/LectureForm'; // Adjust the import path as needed

const LecturePage = ({ match }) => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const lecturesData = await getLectures();
        setLectures(lecturesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lectures:', error);
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  const toggleForm = () => {
    setShowForm(prevShowForm => !prevShowForm);
  };

  return (
    <div>
      <h1>Professor Lectures</h1>
      {loading ? (
        <div>Loading lectures...</div>
      ) : (
        <div>
          <ul>
            {lectures.map(lecture => (
              <li key={lecture.lecture_id}>{lecture.topic}</li>
            ))}
          </ul>
          <button onClick={toggleForm}>
            {showForm ? 'Hide Form' : 'Add New Lecture'}
          </button>
          {showForm && <LectureCreationForm onClose={toggleForm} />}
        </div>
      )}
    </div>
  );
};

export default LecturePage;
