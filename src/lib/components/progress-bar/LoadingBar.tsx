import { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import "./loading-bar.scss";
import { sleep } from "../../../../shared/lib/utilities.mjs";

const LoadingBar = function () {
	const [progressValue, setProgressValue] = useState(1);
	const [count, setCount] = useState(1);

	useEffect(() => {
		const effect = async function () {
			await sleep(1 / 1000);
			if (progressValue < 90) {
				const convergentValue = 10 * Math.log(5 * count);
				setProgressValue(convergentValue);
				setCount(count => count + 1);
			}
		};
		effect();
	}, [progressValue]);
	return <ProgressBar animated now={progressValue} visuallyHidden />;
};

export default LoadingBar;
