export type AdjacencyList = { [key: number]: number[] };

const topologicalSort = (adjacencyList: AdjacencyList): number[][] => {
	const ids: number[] = Object.keys(adjacencyList).map(Number);
	const indegree: { [key: number]: number } = {};

	ids.forEach(id => (indegree[id] = 0));
	Object.values(adjacencyList).forEach(edges => edges.forEach(v => indegree[v]++));

	let count = 0;
	const queue: number[] = ids.filter(id => indegree[id] === 0);

	const result: number[][] = [];
	while (queue.length > 0) {
		const currentLayer: number[] = [];
		for (let i = queue.length; i > 0; i--) {
			const v = queue.shift()!;
			adjacencyList[v].forEach(v => --indegree[v] === 0 && queue.push(v));
			currentLayer.push(v);
			count++;
		}
		result.push(currentLayer);
	}

	if (count !== Object.keys(adjacencyList).length) throw new Error('Graph contains a cycle!');
	return result;
};

export default topologicalSort;
