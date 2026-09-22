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
import { ErrorBoundary } from './components/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Standalone Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Dashboard Layout Routes */}
              <Route element={<DashboardLayout />}>
                {/* Public Learning Roadmaps & Problem Catalogs */}
                <Route path="/java" element={<SubjectPage />} />
                <Route path="/dsa" element={<SubjectPage />} />
                <Route path="/aptitude" element={<SubjectPage />} />
                <Route path="/subjects/:slug" element={<SubjectPage />} />

                {/* Topic & Problem Views */}
                <Route path="/topics/:id" element={<TopicDetailPage />} />
                <Route path="/problems" element={<ProblemListPage />} />
                <Route path="/problems/:id" element={<ProblemDetailPage />} />

                {/* Authenticated Student Features */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/practice"
                  element={
                    <ProtectedRoute>
                      <ComingSoonPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/submissions"
                  element={
                    <ProtectedRoute>
                      <SubmissionHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/friends"
                  element={
                    <ProtectedRoute>
                      <FriendsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/placement"
                  element={
                    <ProtectedRoute>
                      <PlacementPage />
                    </ProtectedRoute>
                  }
                />

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
    </ErrorBoundary>
  );
};

export default App;
