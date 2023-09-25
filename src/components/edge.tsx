import { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';

type Coords = {
	x: number;
	y: number;
	length: number;
	angle: number;
};

const Line = styled.div<{ coords: Coords }>`
	z-index: 0;
	position: absolute;
	width: 3px;
	background: #2020b8;
	height: ${props => props.coords.length}px;
	left: ${props => props.coords.x}px;
	top: ${props => props.coords.y}px;
	transform: translate(-2px, 0) rotate(${props => props.coords.angle}rad);
	transform-origin: top center;

	&::after {
		content: '';
		width: 8px;
		height: 8px;
		border-style: solid;
		border-width: 0 5px 5px 0;
		border-color: #2020f8;
		position: absolute;
		bottom: 0;
		right: 0;
		transform: translate(0, -50%) rotate(45deg) translate(50%, 0);
	}
`;

export type EdgeInfo = {
	id: number;
	from: number;
	to: number;
};

type Props = {
	from: HTMLDivElement;
	to: HTMLDivElement;
};

const Edge: FunctionComponent<Props> = ({ from, to }) => {
	let { offsetLeft: x1, offsetTop: y1, offsetWidth: w1 } = from;
	let { offsetLeft: x2, offsetTop: y2, offsetWidth: w2 } = to;

	if (x1 <= x2) {
		x1 += w1 / 2;
		x2 -= w2 / 2;
	} else {
		x1 -= w1 / 2;
		x2 += w2 / 2;
	}

	const dx = Math.abs(x1 - x2);
	const dy = Math.abs(y1 - y2);

	const length = Math.sqrt(dx * dx + dy * dy);

	let angle = 0;
	if (y1 <= y2) angle = Math.atan(dx / dy);
	else angle = Math.PI / 2 + Math.atan(dy / dx);
	if (x1 <= x2) angle *= -1;

	return <Line coords={{ x: x1, y: y1, length, angle }} />;
};

export default Edge;
