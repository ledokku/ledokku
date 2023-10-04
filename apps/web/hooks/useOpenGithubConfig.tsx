import { GITHUB_APP_NAME } from "@/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface OpenGithubConfigOptions {
  onClosed?: () => void;
}

export function useOpenGithubConfig({
  onClosed,
}: OpenGithubConfigOptions = {}) {
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    setIsWindowOpen(true);
    const githubConfigWindow = window.open(
      `https://github.com/apps/${GITHUB_APP_NAME}/installations/new`,
      "Install App",
      "resizable=1, scrollbars=1, fullscreen=0, height=1000, width=1020,top=" +
        window.screen.width +
        ", left=" +
        window.screen.width +
        ", toolbar=0, menubar=0, status=0"
    );

    if (!githubConfigWindow) return;

    const interval = setInterval(() => {
      if (githubConfigWindow.closed) {
        clearInterval(interval);
        setIsWindowOpen(false);
        onClosed?.();
      }
    }, 100);
  };

  return {
    openGithubConfig: handleOpen,
    isGithubConfigOpen: isWindowOpen,
  };
}
