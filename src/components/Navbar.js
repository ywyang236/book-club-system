// src/components/Navbar.js

import React from 'react';
import styled from 'styled-components';
import '../styles/Navbar.css';

const OverlayBtns = styled.div`
    width: 100%;
    max-width: 30rem;
    display: flex;
    justify-content: space-between;
`;

const OverlayBtn = styled.button`
    width: 50%;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--light-color);
    background: var(--dark-color);
    border: none;
    border-radius: 0.5rem;
    transition: transform 150ms ease;
    outline-color: hsl(var(--hue), 95%, 50%);
    cursor: pointer;
    margin-right: 5px;

    &:hover {
        transform: scale(1.05);
        cursor: pointer;
    }
`;


function Navbar({ onWeekSelect }) {
    return (
        <OverlayBtns>
            {['第一週', '第二週', '第三週', '第四週', '第五週', '第六週'].map((week, index) => (
                <OverlayBtn
                    key={week}
                    onClick={() => onWeekSelect(index + 1)}
                >
                    <span>{week}</span>
                </OverlayBtn>
            ))}
        </OverlayBtns>
    );
}


export default Navbar;

