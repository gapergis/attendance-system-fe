import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import ProfessorCoursePage from "./pages/professor/ProfessorCoursePage";
import ProfessorLecturePage from "./pages/professor/ProfessorLecturePage";
import ProfessorCourseLecturesPage from "./pages/professor/ProfessorCourseLecturesPage";
import ProfessorLectureDetailsPage from "./pages/professor/ProfessorLectureDetailsPage";
import StudentCoursePage from "./pages/student/StudentCoursePage";
import StudentCourseLecturesPage from "./pages/student/StudentCourseLecturesPage";
import StudentLectureDetailsPage from "./pages/student/StudentLectureDetailsPage";
import StudentLecturePage from "./pages/student/StudentLecturePage";
import { useAuth } from "./services/authService";

const App = () => {
  const { addUserToDatabase, loadUserProfile } = useAuth();
  const { keycloak } = useKeycloak();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect called");
    const checkUser = async () => {
      if (keycloak.authenticated) {
        try {
          const profile = await loadUserProfile(keycloak);
          console.log("Profile:", profile);
          setUser(profile);
          if (profile) {
            await addUserToDatabase(profile);
            console.log("User added to database");
          }
        } catch (err) {
          console.error("Error during Keycloak initialization:", err);
        }
      }
      setLoading(false);
    };

    checkUser();
  }, [keycloak, addUserToDatabase, loadUserProfile]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute allowedRoles={["professor"]} />}>
            <Route path="" element={<Navigate to="/professor/courses" />} />
            <Route path="/" element={<Navigate to="/professor/courses" />} />
            <Route
              path="/professor/courses"
              element={<ProfessorCoursePage />}
            />
            <Route
              path="/professor/courses/lectures/:courseId"
              element={<ProfessorCourseLecturesPage />}
            />
            <Route
              path="/professor/courses/lectures/lecture/:lectureId"
              element={<ProfessorLectureDetailsPage />}
            />
            <Route
              path="/professor/lectures"
              element={<ProfessorLecturePage />}
            />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="" element={<Navigate to="/student/courses" />} />
            <Route path="/" element={<Navigate to="/student/courses" />} />
            <Route path="/student/courses" element={<StudentCoursePage />} />
            <Route
              path="/student/courses/lectures/:courseId"
              element={<StudentCourseLecturesPage />}
            />
            <Route
              path="/student/courses/lectures/lecture/:lectureId"
              element={<StudentLectureDetailsPage />}
            />
            <Route path="/student/lectures" element={<StudentLecturePage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
