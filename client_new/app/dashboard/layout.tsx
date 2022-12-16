import React from "react";
import { DashboardLayout } from "./components/Layout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout>
        {children}
    </DashboardLayout>
}