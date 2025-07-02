import "./header.scss";

const Header = () => {
	return (
		<div className="header">
			<div className="header-content">
				<div className="logo">
					<img className="header-icon" src="/watering-plants.png" />
					<span className="header-title">Intelligent Irrigation</span>
				</div>
				<a href="https://youtu.be/i36kXP_ZwiE">View Demo</a>
			</div>
		</div>
	);
};

export default Header;
