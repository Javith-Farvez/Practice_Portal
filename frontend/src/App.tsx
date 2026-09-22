import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { DashboardLayout } from './components/DashboardLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { SubjectPage } from './pages/SubjectPage';
import { TopicDetailPage } from './pages/TopicDetailPage';
import { ProblemListPage } from './pages/ProblemListPage';
import { ProblemDetailPage } from './pages/ProblemDetailPage';
import { FriendsPage } from './pages/FriendsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { AdminPage } from './pages/AdminPage';
import { PlacementPage } from './pages/PlacementPage';
import { SubmissionHistoryPage } from './pages/SubmissionHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage, ForbiddenPage, ServerErrorPage } from './pages/ErrorPages';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Dashboard Layout Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Learning Roadmaps & Subject Views */}
              <Route path="/java" element={<SubjectPage />} />
              <Route path="/dsa" element={<SubjectPage />} />
              <Route path="/aptitude" element={<SubjectPage />} />
              <Route path="/subjects/:slug" element={<SubjectPage />} />

              {/* Topic & Problem Views */}
              <Route path="/topics/:id" element={<TopicDetailPage />} />
              <Route path="/problems" element={<ProblemListPage />} />
              <Route path="/problems/:id" element={<ProblemDetailPage />} />

              {/* Feature Modules */}
              <Route path="/practice" element={<ComingSoonPage />} />
              <Route path="/submissions" element={<SubmissionHistoryPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/friends" element={<FriendsPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/problems"
                element={
                  <AdminRoute>
                    <AdminPage defaultTab="problems" />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/problems/create"
                element={
                  <AdminRoute>
                    <AdminPage defaultTab="problems" createOnMount={true} />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/problems/:id/edit"
                element={
                  <AdminRoute>
                    <AdminPage defaultTab="problems" />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminPage defaultTab="users" />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/import"
                element={
                  <AdminRoute>
                    <AdminPage defaultTab="import" />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/audit"
                element={
                  <AdminRoute>
                    <AdminPage defaultTab="audit" />
                  </AdminRoute>
                }
              />
              {/* Phase 8: Placement Mode */}
              <Route path="/placement" element={<PlacementPage />} />
            </Route>

            {/* Error Pages */}
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/500" element={<ServerErrorPage />} />

            {/* Catch-all 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
