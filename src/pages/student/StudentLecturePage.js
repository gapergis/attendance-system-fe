import React, { useState, useEffect } from 'react';
import { getLectures } from '../../services/lectureService';


const LecturePage = ({ match }) => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

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
  });

  return (
    <div>
      <h1>Lectures</h1>
      {loading ? (
        <div>Loading lectures...</div>
      ) : (
        <ul>
          {lectures.map(lecture => (
            <li key={lecture.lecture_id}>{lecture.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LecturePage;
