'use client'

import { Container, Image, useTheme } from "@nextui-org/react";
import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { isDark } = useTheme();

    return <>
        <div className="blur-3xl absolute w-full" style={{ zIndex: -10, filter: 'blur(64px)' }}>
            <Image
                src={isDark ? '/bg_dark.jpg' : '/bg_light.jpg'}
                height="15vh"
                objectFit="cover"
                alt="background"
            />
        </div>
        <div className="flex flex-col" style={{ minHeight: '100vh' }}>
            <Header />
            <Container className="py-16" lg>
                {children}
            </Container>
            <div className="flex-grow" />
            <Footer />
        </div>
    </>
}