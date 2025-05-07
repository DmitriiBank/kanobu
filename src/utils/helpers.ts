export function getRandomIndexes(arrayLength: number, count: number) {
    const indexes = new Set<number>();
    while (indexes.size < count && indexes.size < arrayLength) {
        indexes.add(Math.floor(Math.random() * arrayLength));
    }
    return Array.from(indexes);
}
