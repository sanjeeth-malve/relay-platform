import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

export function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const handleClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      wasOpenRef.current = true;
      closeButtonRef.current?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          handleClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      toggleButtonRef.current?.focus();
    }
  }, [isSidebarOpen, handleClose]);

  return (
    <div className="flex h-screen w-full overflow-x-hidden bg-canvas text-text-primary">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleClose}
        closeButtonRef={closeButtonRef}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          toggleButtonRef={toggleButtonRef}
        />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
