import "./styles/index.scss";
import React from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import { Worker } from "@react-pdf-viewer/core";

import Layout from "./pages/Layout/Layout";
import AuthPage from "./pages/AuthPages/AuthPage";
import DelegatePage from "./pages/DelegatePage/DelegatePage";
import Landing from "./pages/Landing/Landing";
import PrivateRoute from "./utils/PrivateRoute";
import AdminPrivateRoute from "./utils/AdminPrivateRoute";
import ResetPassword from "./pages/ResetPassword";
import OpenPages from "./pages/OpenPages/OpenPages";

import Profile from "./pages/ProfilePage/Profile";
import Events from "./pages/EventPage/EventPage";
import MyEvents from "./pages/MyEvents/MyEvents";
import Proshow from "./pages/Proshow/Proshow";
import InsideEvent from "./components/InsideEvent/InsideEvent";
import VerifyAnimation from "./components/VerifyAnimation/VerifyAnimation";
import NotFound from "./components/NotFound";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import Login from "../src/admin/login/login";
import Dashboard from "./admin/category/dashboard/Dashboard";
import Rulebook from "./pages/Rulebook/Rulebook";
import TicketDashboard from "./admin/tickets/TicketDashboard";

function App() {
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
  console.log = () => {};
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route exact path="/login" element={<AuthPage />} />
            <Route
              exact
              path="/dashboard/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/dashboard/proshow"
              element={
                <PrivateRoute>
                  <Layout activeTab="proshow">
                    <Proshow />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/dashboard/events"
              element={
                <Layout activeTab="events">
                  <Events />
                </Layout>
              }
            />
            <Route
              exact
              path="/dashboard/myevents"
              element={
                <PrivateRoute>
                  <Layout activeTab="my-events">
                    <MyEvents />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/dashboard/event/:eventid"
              element={
                <PrivateRoute>
                  <InsideEvent />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/dashboard/myevents/:eventid"
              element={
                <PrivateRoute>
                  <InsideEvent />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/delegatecard"
              element={
                <Layout activeTab="delegate-card">
                  <DelegatePage />
                </Layout>
              }
            />
            <Route
              exact
              path="/dashboard"
              element={<Navigate to="/dashboard/profile" />}
            />
            <Route
              exact
              path="/forgetpass/:passtoken"
              element={<ResetPassword />}
            />
            <Route path="/verify/:token" element={<VerifyEmail />} />
            <Route path="/verified" element={<VerifyAnimation />} />
            <Route
              path="/rulebook"
              element={
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.min.js">
                  <Rulebook />
                </Worker>
              }
            />
            <Route
              exact
              path="/events"
              element={<OpenPages pageType="events" />}
            />
            <Route
              exact
              path="/tshirts"
              element={<OpenPages pageType="coming-soon" />}
            />
            <Route
              exact
              path="/schedule"
              element={<OpenPages pageType="coming-soon" />}
            />
            {/* <Route exact path="/proshow" element={<OpenPages pageType="proshow"/>} /> */}
            <Route exact path="/admin" element={<Login />} />
            <Route
              exact
              path="/admin/dashboard"
              element={
                <AdminPrivateRoute>
                  <Dashboard />
                </AdminPrivateRoute>
              }
            />
            <Route exact path="/admin/payment" element={<TicketDashboard />} />
            <Route exact path="/" element={<Landing />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
