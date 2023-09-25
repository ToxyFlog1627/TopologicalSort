import { MouseEvent, FunctionComponent, MutableRefObject } from 'react';
import styled from 'styled-components';

const Container = styled.div<{ x: number; y: number }>`
	position: absolute;
	width: 120px;
	height: 40px;
	top: ${props => props.y}px;
	left: ${props => props.x}px;
	background: #000;
	transform: translate(-50%, -50%);
	user-select: none;
	cursor: pointer;
	z-index: 1;
	border-radius: 999px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const InlineInput = styled.input`
	width: 75%;
	color: #fff;
	outline: none;
	font-size: 12px;
	text-align: center;
	border: none;
	background: transparent;
`;

export type VertexInfo = {
	id: number;
	x: number;
	y: number;
	text: string;
};

type Props = VertexInfo & {
	setText: (text: string) => void;
	createEdge: (from: number, to: number) => void;
	containerRef: (element: HTMLDivElement) => void;
	lastVertexIdRef: MutableRefObject<number>;
};

const Vertex: FunctionComponent<Props> = ({ id, x, y, text, setText, createEdge, containerRef, lastVertexIdRef }) => {
	const onMouseDown = (event: MouseEvent) => {
		lastVertexIdRef.current = id;
		event.stopPropagation();
	};

	const onMouseUp = (event: MouseEvent) => {
		if (lastVertexIdRef.current === -1) return;

		createEdge(lastVertexIdRef.current, id);
		event.stopPropagation();
	};

	return (
		<Container x={x} y={y} onMouseDown={onMouseDown} onMouseUp={onMouseUp} ref={containerRef}>
			<InlineInput value={text} onChange={event => setText((event.target as HTMLInputElement).value)} />
		</Container>
	);
};

export default Vertex;
