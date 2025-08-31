import "./header.scss";

const Header = () => {
	return (
		<div className="header">
			<div className="header-content">
				<div className="logo">
					<img className="header-icon" src="/watering-plants.png" />
					<span className="header-title">Intelligent Irrigation</span>
				</div>
			</div>
		</div>
	);
};

export default Header;
