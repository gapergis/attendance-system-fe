// src/components/CourseCreationForm.js
import React, { useState } from "react";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";
import "../App.css"; // Import the CSS file

const CourseCreationForm = ({ professorId, onClose }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { keycloak } = useKeycloak();
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `${apiUrl}/courses/add`,
        {
          title: courseName,
          description: description,
          professorId: professorId, // Use professorId passed as prop
        },
      );

      setSuccessMessage("Course created successfully");
      setErrorMessage("");
      console.log("Course created successfully:", response.data);

      // Reset form fields
      setCourseName("");
      setDescription("");

      // Close the form
      onClose();

      // Refresh the course page to see the new course (assuming it's managed by CoursePage component)
      window.location.reload();
    } catch (error) {
      console.error("Error creating course:", error.message);
      setErrorMessage("Error creating course. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="course-form-container">
      {keycloak.hasRealmRole("professor") ? (
        <form onSubmit={handleSubmit}>
          <label>
            Course Name:
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <button type="submit">Create Course</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
        </form>
      ) : (
        <div>You are not authorized to access this page.</div>
      )}
    </div>
  );
};

export default CourseCreationForm;
