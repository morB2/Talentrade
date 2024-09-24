import { Navigate, Route, Routes } from "react-router-dom";
import LogIn from "./LogIn";
import Register from "./Register";
import NotFound from "./NotFound";
import Profile from "./Profile";
import Home from "./Home";
import About from "./About";
import Header from "./Header";
import ServiceForm from "./ServiceForm";
import CategoryPage from "./Categories";
import ServiceDetails from "./ServiceDetails";
import ErrorPage from "./ErrorPage";
import AdminPanel from "./AdminPanel";

/**
 * RoutesComponent
 * Defines the routing structure for the application.
 * Includes routes for user and admin sections, and handles navigation and redirection.
 */
export default function RoutesComponent() {
  return (
    <Routes>
      {/* Default route: Redirects to user profile if no specific route is matched */}
      <Route index element={<Navigate replace to="users/:userId" />} />

      {/* User routes with a shared Header component */}
      <Route path="users/:userId" element={<Header />}>
        {/* Home page for user */}
        <Route index element={<Home />} />
        {/* User profile page */}
        <Route path="profile" element={<Profile />} />
        {/* About page */}
        <Route path="about" element={<About />} />
        {/* Service request form */}
        <Route path="request" element={<ServiceForm />} />
        {/* Service offer form */}
        <Route path="offer" element={<ServiceForm />} />
        {/* Category page with nested routes for services */}
        <Route path="categories/:category">
          <Route index element={<CategoryPage />} />
          <Route path="services/:id" element={<ServiceDetails />} />
        </Route>
        {/* Custom error page for handling application errors */}
        <Route path="error" element={<ErrorPage />} />
        {/* Catch-all route for undefined paths under user routes */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Registration and login routes without Header */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/error" element={<ErrorPage />} />
      {/* Catch-all route for undefined paths not under user routes */}
      <Route path="*" element={<NotFound />} />

      {/* Admin routes with a shared Header component */}
      <Route path="/admin/:adminId" element={<Header />}>
        {/* Admin panel home page */}
        <Route index element={<AdminPanel />} />
        {/* Admin profile page */}
        <Route path="profile" element={<Profile />} />
        {/* Category page with nested routes for services under admin */}
        <Route path="categories/:category">
          <Route index element={<CategoryPage />} />
          <Route path="services/:id" element={<ServiceDetails />} />
        </Route>
      </Route>
    </Routes>
  );
}
