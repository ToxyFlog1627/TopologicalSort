import { FunctionComponent, MouseEvent, MutableRefObject, RefObject, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Vertex, { VertexInfo } from './vertex';
import Edge, { EdgeInfo } from './edge';

const Container = styled.div`
	width: 90vw;
	height: 80vh;
	padding: 5px;
	background: #3f3f3f;
	border-radius: 5px;
	position: relative;
`;

export type GraphInfo = {
	vertices: VertexInfo[];
	edges: EdgeInfo[];
};

type Props = {
	graph: GraphInfo;
	setGraph: (graph: GraphInfo) => void;
	containerRef: RefObject<HTMLDivElement>;
	vertexRefs: MutableRefObject<{ [key: number]: HTMLDivElement }>;
};

const Graph: FunctionComponent<Props> = ({ graph, setGraph, containerRef, vertexRefs }) => {
	const [updateEdge, setUpdateEdge] = useState(false);
	const vertexId = useRef(0);
	const edgeId = useRef(0);
	const lastVertexIdRef = useRef(-1);

	const { vertices, edges } = graph;

	const setVertices = (vertices: VertexInfo[]) => setGraph({ vertices, edges: graph.edges });
	const updateVertex = (id: number, newInfo: Partial<VertexInfo>) => setVertices(vertices.map(current => (current.id === id ? { ...current, ...newInfo } : current)));
	const createVertex = (event: MouseEvent) => {
		if (!containerRef.current) return;
		if (lastVertexIdRef.current !== -1) {
			lastVertexIdRef.current = -1;
			return;
		}
		if (document.elementFromPoint(event.pageX, event.pageY) !== containerRef.current) return;

		const id = vertexId.current++;
		const x = event.pageX - containerRef.current.offsetLeft;
		const y = event.pageY - containerRef.current.offsetTop;
		setVertices([...vertices, { id, x, y, text: `Vertex #${id}` }]);
		event.stopPropagation();
	};
	const deleteVertex = (id: number) => {
		const newVertices = vertices.filter(v => v.id !== id);
		delete vertexRefs.current[id];
		lastVertexIdRef.current = -1;

		setGraph({
			edges: edges.filter(e => e.from !== id && e.to !== id),
			vertices: newVertices
		});
	};

	const setEdges = (edges: EdgeInfo[]) => setGraph({ vertices: graph.vertices, edges });
	const createEdge = (from: number, to: number) => {
		lastVertexIdRef.current = -1;
		if (from === to) return;
		if (edges.some(current => current.from === from && current.to === to)) setEdges(edges.filter(current => !(current.from === from && current.to === to)));
		else setEdges([...edges, { id: edgeId.current++, from, to }]);
	};

	useEffect(() => {
		setUpdateEdge(!updateEdge);
		vertexId.current = graph.vertices.reduce((max, cur) => Math.max(max, cur.id + 1), 0);
		edgeId.current = graph.edges.reduce((max, cur) => Math.max(max, cur.id + 1), 0);
	}, [graph]);

	return (
		<Container ref={containerRef} onClick={createVertex}>
			{vertices.map(vertexInfo => (
				<Vertex
					key={vertexInfo.id}
					{...vertexInfo}
					setText={(text: string) => updateVertex(vertexInfo.id, { text })}
					createEdge={createEdge}
					deleteVertex={() => deleteVertex(vertexInfo.id)}
					containerRef={(element: HTMLDivElement) => (vertexRefs.current[vertexInfo.id] = element)}
					lastVertexIdRef={lastVertexIdRef}
				/>
			))}
			{edges.map(({ id, from, to }) => (
				<Edge key={id} from={vertexRefs.current[from]} to={vertexRefs.current[to]} />
			))}
		</Container>
	);
};

export default Graph;
