"use client";

import { createPortal } from "react-dom";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    XIcon
} from "lucide-react";
import {
    Button
} from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useShallow } from "zustand/react/shallow";

interface Position {
    x: number;
    y: number;
}

const MINIMIZED_WIDTH = 321;
const MINIMIZED_HEIGHT = 57;

export function BlueLightViewerDialog() {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const { isOpen, close } = useBlueLightViewerStore();
    const { studyInstanceUid, seriesInstanceUid }= useBlueLightViewerStore(useShallow((state) => ({
        studyInstanceUid: state.studyInstanceUid,
        seriesInstanceUid: state.seriesInstanceUid,
    })));

    // 使用 ref 來儲存 position，避免重新觸發渲染
    const positionRef = useRef({ x: 100, y: 100 });
    const dragStartRef = useRef({ x: 0, y: 0 });
    const dragStartPositionRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number | null>(null);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const iframeSrc = useMemo(() => {
        const params = new URLSearchParams();
        params.set("StudyInstanceUID", studyInstanceUid || "");
        if (seriesInstanceUid) {
            params.set("SeriesInstanceUID", seriesInstanceUid);
        }

        return `/html/bluelight/bluelight/html/start.html?${params.toString()}`;
    }, [studyInstanceUid, seriesInstanceUid]);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    const clampPosition = useCallback((pos: Position) => {
        const maxX = window.innerWidth - MINIMIZED_WIDTH;
        const maxY = window.innerHeight - MINIMIZED_HEIGHT;

        return {
            x: Math.max(0, Math.min(pos.x, maxX)),
            y: Math.max(0, Math.min(pos.y, maxY)),
        }
    }, []);

    const updateContainerPosition = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.style.left = `${positionRef.current.x}px`;
            containerRef.current.style.top = `${positionRef.current.y}px`;
        }
    }, []);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("button")) return;
        if (!isMounted || !isMinimized) return;

        e.preventDefault();

        setIsDragging(true);

        dragStartRef.current = { x: e.clientX, y: e.clientY };
        dragStartPositionRef.current = { ...positionRef.current };

        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isMinimized || !isDragging) return;

        if (e.buttons === 0) return;

        e.preventDefault();

        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        const newPosition = {
            x: dragStartPositionRef.current.x + deltaX,
            y: dragStartPositionRef.current.y + deltaY,
        };

        positionRef.current = clampPosition(newPosition);

        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        
        animationFrameRef.current = requestAnimationFrame(updateContainerPosition);
    }, [isDragging, updateContainerPosition]);

    const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            positionRef.current = clampPosition(positionRef.current);
            updateContainerPosition();
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [clampPosition, updateContainerPosition]);

    useEffect(() => {
        if (isOpen && isMinimized) {
            setIsMinimized(false);
        }

        if (iframeRef.current && isOpen) {
            iframeRef.current.src = iframeSrc;
        }
    }, [isOpen, studyInstanceUid, seriesInstanceUid]);

    useEffect(() => {
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    }, []);

    if (!isOpen || !isMounted) return null;

    const containerStyle = isMinimized ? {
        position: "absolute" as const,
        left: `${positionRef.current.x}px`,
        top: `${positionRef.current.y}px`,
        width: "20rem",
        height: "3.5rem",
        userSelect: "none" as const,
    } : {
        position: "fixed" as const,
        inset: 0,
        userSelect: "auto" as const,
    };

    const iframeContainerStyle = {
        display: isMinimized ? "none" : "block",
    };

    const content = (
        <div 
            className={cn(
                "bg-background border rounded-lg shadow-lg transition-all duration-300 z-50",
                isMinimized ? "transition-all duration-200 ease-out" : "transition-none"
            )}
            style={containerStyle}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            ref={containerRef}
        >
            {/* 半透明背景，僅在全屏時顯示 | Semi-transparent backdrop, only visible in fullscreen */}
            {!isMinimized && (
                <div 
                    className="absolute inset-0 bg-black/50 -z-10" 
                    onClick={() => close()}
                />
            )}

            {/* 標題欄 | Header */}
            <div 
                className={cn(
                    "flex items-center justify-between p-2 bg-background",
                    isMinimized ? "cursor-move" : "border-b"
                )}
                style={{
                    userSelect: "none",
                }}
            >
                <h2 className="text-lg font-semibold">BlueLight Viewer</h2>
                <div className="flex items-center gap-2">
                    <Button
                        variant={"ghost"}
                        size="sm"
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="h-8 w-8 p-0"
                    >
                        {isMinimized ? (
                            <ChevronUpIcon className="size-4" />
                        ) : (
                            <ChevronDownIcon className="size-4" />
                        )}
                    </Button>

                    <Button
                        variant={"ghost"}
                        size="sm"
                        onClick={() => close()}
                        className="h-8 w-8 p-0"
                    >
                        <XIcon className="size-4" />
                    </Button>
                </div>
            </div>

            {/* iframe 容器，始終在 DOM 中但根據 isMinimized 隱藏 | iframe container always in DOM but hidden based on isMinimized */}
            <div style={iframeContainerStyle} className="w-full h-[calc(100%-3rem)]">
                <iframe
                    ref={iframeRef}
                    src={iframeSrc}
                    className="w-full border-0 h-full"
                    title="BlueLight Viewer"
                />
            </div>
        </div>
    );

    return createPortal(content, document.body);
}