import "./header.scss";

const Header = () => {
	return (
		<div className="header">
			<div className="header-content">
				<img className="header-icon" src="/watering-plants.png" />
				<span className="header-title">
					Smart Farm Irrigation System
				</span>
			</div>
		</div>
	);
};

export default Header;
