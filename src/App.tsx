import { FunctionComponent, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Graph, { GraphInfo } from './components/graph';
import topologicalSort, { AdjacencyList } from './sort';

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: sans-serif;
    }

    body {
        background: #202020;
        color: #EAEAEA;
    }
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	width: 100vw;
	height: 100vh;
`;

const Button = styled.button`
	padding: 4px 10px;
	border: 1px solid #b8b8b8;
	border-radius: 5px;
	font-size: 14px;
	cursor: pointer;
	outline: none;
`;

const App: FunctionComponent = () => {
	const [graph, setGraph] = useState<GraphInfo>({ vertices: [], edges: [] });
	const graphContainerRef = useRef<HTMLDivElement>(null);
	const vertexRefs = useRef<HTMLDivElement[]>([]);

	const sort = () => {
		if (!graphContainerRef.current) return;

		const adjacencyList: AdjacencyList = {};
		graph.vertices.forEach(({ id }) => (adjacencyList[id] = []));
		graph.edges.forEach(({ from, to }) => adjacencyList[from].push(to));

		const sortedGraph = topologicalSort(adjacencyList);

		const { offsetWidth: width, offsetHeight: height } = graphContainerRef.current;

		const maxWidth: number[] = sortedGraph.map(layer => layer.reduce((max, current) => Math.max(max, vertexRefs.current[current].offsetWidth), 0));
		const totalVertexWidth = maxWidth.reduce((sum, current) => sum + current, 0);
		const vertexHorizontalMargin = (width - totalVertexWidth) / (sortedGraph.length + 1);

		const newVertices = [...graph.vertices];

		let xOffset = vertexHorizontalMargin;
		sortedGraph.forEach((layer, i) => {
			const totalVertexHeight = layer.reduce((sum, id) => sum + vertexRefs.current[id].offsetHeight, 0);
			const vertexVerticalMargin = (height - totalVertexHeight) / (layer.length + 1);

			let yOffset = vertexVerticalMargin;
			layer.forEach(id => {
				const width = vertexRefs.current[id].offsetWidth;
				const height = vertexRefs.current[id].offsetHeight;

				newVertices[id].x = xOffset + width / 2;
				newVertices[id].y = yOffset + height / 2;

				yOffset += height + vertexVerticalMargin;
			});

			xOffset += maxWidth[i] + vertexHorizontalMargin;
		});

		setGraph({ vertices: newVertices, edges: graph.edges });
	};

	return (
		<Container>
			<GlobalStyles />
			<h1>Graph</h1>
			<Button onClick={sort}>Sort</Button>
			<Graph graph={graph} setGraph={setGraph} containerRef={graphContainerRef} vertexRefs={vertexRefs} />
		</Container>
	);
};

export default App;
