import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { BrowserRouter, Route, Routes } from "react-router";
import { AppShell } from "./layouts/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { WorkspacePage } from "./pages/WorkspacePage";

const TaskExecutionPage = lazy(() =>
  import("./pages/TaskExecutionPage").then((module) => ({
    default: module.TaskExecutionPage,
  })),
);

const MyTasksPage = lazy(() =>
  import("./pages/MyTasksPage").then((module) => ({
    default: module.MyTasksPage,
  })),
);

const ReportsPage = lazy(() =>
  import("./pages/ReportsPage").then((module) => ({
    default: module.ReportsPage,
  })),
);

const ReportDetailPage = lazy(() =>
  import("./pages/ReportDetailPage").then((module) => ({
    default: module.ReportDetailPage,
  })),
);

const ApprovalsPage = lazy(() =>
  import("./pages/ApprovalsPage").then((module) => ({
    default: module.ApprovalsPage,
  })),
);

const TeamPage = lazy(() =>
  import("./pages/TeamPage").then((module) => ({
    default: module.TeamPage,
  })),
);

const ProfilePage = lazy(() =>
  import("./pages/ProfilePage").then((module) => ({
    default: module.ProfilePage,
  })),
);

const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<AppShell />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/workspace" element={<WorkspacePage />} />
              <Route
                path="/tasks"
                element={
                  <Suspense
                    fallback={
                      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-3.5">
                        <div className="h-24 rounded-[6px] border border-border-default bg-surface-1 p-4 font-mono text-xs text-text-metadata">
                          Loading task queue...
                        </div>
                      </div>
                    }
                  >
                    <MyTasksPage />
                  </Suspense>
                }
              />
              <Route
                path="/tasks/:taskId"
                element={
                  <Suspense
                    fallback={
                      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3.5">
                        <div className="h-24 rounded-[6px] border border-border-default bg-surface-1 p-4 font-mono text-xs text-text-metadata">
                          Loading execution workspace...
                        </div>
                      </div>
                    }
                  >
                    <TaskExecutionPage />
                  </Suspense>
                }
              />
              <Route
                path="/reports"
                element={
                  <Suspense
                    fallback={
                      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-3.5">
                        <div className="h-24 rounded-[6px] border border-border-default bg-surface-1 p-4 font-mono text-xs text-text-metadata">
                          Loading reports registry...
                        </div>
                      </div>
                    }
                  >
                    <ReportsPage />
                  </Suspense>
                }
              />
              <Route
                path="/reports/:reportId"
                element={
                  <Suspense
                    fallback={
                      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3.5">
                        <div className="h-24 rounded-[6px] border border-border-default bg-surface-1 p-4 font-mono text-xs text-text-metadata">
                          Loading research report...
                        </div>
                      </div>
                    }
                  >
                    <ReportDetailPage />
                  </Suspense>
                }
              />
              <Route
                path="/approvals"
                element={
                  <Suspense
                    fallback={
                      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3.5">
                        <div className="h-24 rounded-[6px] border border-border-default bg-surface-1 p-4 font-mono text-xs text-text-metadata">
                          Loading governance approvals queue...
                        </div>
                      </div>
                    }
                  >
                    <ApprovalsPage />
                  </Suspense>
                }
              />
              <Route
                path="/team"
                element={
                  <Suspense
                    fallback={
                      <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-3.5">
                        <div className="h-24 rounded-[6px] border border-border-default bg-surface-1 p-4 font-mono text-xs text-text-metadata">
                          Loading organization directory...
                        </div>
                      </div>
                    }
                  >
                    <TeamPage />
                  </Suspense>
                }
              />
              <Route
                path="/profile"
                element={
                  <Suspense
                    fallback={
                      <div className="mx-auto flex w-full max-w-[820px] flex-col gap-3.5">
                        <div className="h-24 rounded-[6px] border border-border-default bg-surface-1 p-4 font-mono text-xs text-text-metadata">
                          Loading personal profile...
                        </div>
                      </div>
                    }
                  >
                    <ProfilePage />
                  </Suspense>
                }
              />
              <Route
                path="/settings"
                element={
                  <Suspense
                    fallback={
                      <div className="mx-auto flex w-full max-w-[820px] flex-col gap-3.5">
                        <div className="h-24 rounded-[6px] border border-border-default bg-surface-1 p-4 font-mono text-xs text-text-metadata">
                          Loading workspace settings...
                        </div>
                      </div>
                    }
                  >
                    <SettingsPage />
                  </Suspense>
                }
              />
              <Route
                path="*"
                element={
                  <PlaceholderPage
                    title="Page Not Found"
                    description="The requested route does not exist in RELAY."
                    routePath="*"
                  />
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </QueryClientProvider>
  );
}

export default App;
