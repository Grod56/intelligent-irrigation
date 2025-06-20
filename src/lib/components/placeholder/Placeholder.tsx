import Spinner from "react-bootstrap/Spinner";
import "./placeholder.scss";

const Placeholder = function () {
	return (
		<div className="placeholder">
			<Spinner className="spinner" animation="border" />
		</div>
	);
};

export default Placeholder;
