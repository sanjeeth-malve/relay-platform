export type NavGroupName = "Workspace" | "Management" | "Personal";

export type NavIconName =
  | "overview"
  | "workspace"
  | "tasks"
  | "reports"
  | "approvals"
  | "team"
  | "profile"
  | "settings";

export interface NavItem {
  label: string;
  path: string;
  group: NavGroupName;
  icon: NavIconName;
}

export interface NavGroup {
  name: NavGroupName;
  items: NavItem[];
}

export const SIDEBAR_GROUPS: NavGroup[] = [
  {
    name: "Workspace",
    items: [
      { label: "Overview", path: "/", group: "Workspace", icon: "overview" },
      {
        label: "AI Workspace",
        path: "/workspace",
        group: "Workspace",
        icon: "workspace",
      },
      { label: "My Tasks", path: "/tasks", group: "Workspace", icon: "tasks" },
      { label: "Reports", path: "/reports", group: "Workspace", icon: "reports" },
    ],
  },
  {
    name: "Management",
    items: [
      {
        label: "Approvals",
        path: "/approvals",
        group: "Management",
        icon: "approvals",
      },
      { label: "Team", path: "/team", group: "Management", icon: "team" },
    ],
  },
  {
    name: "Personal",
    items: [
      {
        label: "Profile",
        path: "/profile",
        group: "Personal",
        icon: "profile",
      },
      {
        label: "Settings",
        path: "/settings",
        group: "Personal",
        icon: "settings",
      },
    ],
  },
];

export function getBreadcrumbs(pathname: string): string[] {
  if (pathname === "/") return ["Workspace", "Overview"];
  if (pathname === "/workspace") return ["Workspace", "AI Workspace"];
  if (pathname === "/tasks") return ["Workspace", "My Tasks"];
  if (pathname.startsWith("/tasks/")) {
    const id = pathname.slice("/tasks/".length);
    return ["Workspace", "My Tasks", id || "Task Execution"];
  }
  if (pathname === "/reports") return ["Workspace", "Reports"];
  if (pathname.startsWith("/reports/")) {
    const id = pathname.slice("/reports/".length);
    return ["Workspace", "Reports", id || "Report Detail"];
  }
  if (pathname === "/approvals") return ["Management", "Approvals"];
  if (pathname === "/team") return ["Management", "Team"];
  if (pathname === "/profile") return ["Personal", "Profile"];
  if (pathname === "/settings") return ["Personal", "Settings"];
  return ["Workspace", "Not Found"];
}
