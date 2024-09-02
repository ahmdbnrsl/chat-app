'use client';
import { useState, useCallback, MouseEvent, TouchEvent } from 'react';

const LongPressButton: React.FC = () => {
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const [pressTimeout, setPressTimeout] = useState<NodeJS.Timeout | null>(
        null
    );

    const handleLongPress = useCallback((): void => {
        console.log('Long press triggered!');
    }, []);

    const handleMouseDown = (event: MouseEvent<HTMLDivElement>): void => {
        setIsPressed(true);
        const timeout = setTimeout(handleLongPress, 500);
        setPressTimeout(timeout);
    };

    const handleMouseUp = (event: MouseEvent<HTMLDivElement>): void => {
        setIsPressed(false);
        if (pressTimeout) {
            clearTimeout(pressTimeout);
            setPressTimeout(null);
        }
    };

    const handleMouseLeave = (event: MouseEvent<HTMLDivElement>): void => {
        setIsPressed(false);
        if (pressTimeout) {
            clearTimeout(pressTimeout);
            setPressTimeout(null);
        }
    };

    const handleTouchStart = (event: TouchEvent<HTMLDivElement>): void => {
        setIsPressed(true);
        const timeout = setTimeout(handleLongPress, 500);
        setPressTimeout(timeout);
    };

    const handleTouchEnd = (event: TouchEvent<HTMLDivElement>): void => {
        setIsPressed(false);
        if (pressTimeout) {
            clearTimeout(pressTimeout);
            setPressTimeout(null);
        }
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`p-4 rounded-md transition duration-300 ${
                isPressed ? 'bg-blue-600' : 'bg-blue-500'
            } hover:bg-blue-700 text-white`}
        >
            Long Press Me
        </div>
    );
};

export default LongPressButton;
