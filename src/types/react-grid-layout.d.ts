// src/types/react-grid-layout.d.ts
declare module 'react-grid-layout' {
    import * as React from 'react';

    export interface Layout {
        i: string;
        x: number;
        y: number;
        w: number;
        h: number;
        static?: boolean;
        isDraggable?: boolean;
        isResizable?: boolean;
        minW?: number;
        maxW?: number;
        minH?: number;
        maxH?: number;
    }

    export interface ReactGridLayoutProps {
        className?: string;
        style?: React.CSSProperties;
        layout: Layout[];
        cols: number;
        rowHeight: number;
        width: number;
        onLayoutChange?: (layout: Layout[]) => void;
        children?: React.ReactNode;
        draggableHandle?: string;
    }

    export default class ReactGridLayout extends React.Component<ReactGridLayoutProps> {}
}
