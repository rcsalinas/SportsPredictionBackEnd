export function decrementClock(clock: string, decrement: number = 60): string {
	let [min, sec] = clock.split(":").map(Number);
	let totalSeconds = min * 60 + sec - decrement;
	if (totalSeconds < 0) totalSeconds = 0;
	const newMin = Math.floor(totalSeconds / 60);
	const newSec = totalSeconds % 60;
	return `${newMin}:${newSec.toString().padStart(2, "0")}`;
}

export function nextPeriod(current: string): string | null {
	const periods = ["1st", "2nd", "3rd", "4th"];
	const idx = periods.indexOf(current);
	if (idx === -1 || idx === periods.length - 1) return null;
	return periods[idx + 1];
}
