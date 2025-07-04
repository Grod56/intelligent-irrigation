import "./footer.scss";

const Footer = () => {
	return (
		<div className="footer">
			<div className="footer-content">
				<span className="copyright-text">
					&copy; 2025 Garikai Rodney Gumbo. All rights reserved.
				</span>
				<hr />
				<a
					className="weatherapi"
					href="https://www.weatherapi.com/"
					title="Free Weather API"
					target="_blank"
				>
					<img
						src="//cdn.weatherapi.com/v4/images/weatherapi_logo.png"
						alt="Weather data by WeatherAPI.com"
					/>
				</a>
				<a
					className="repository"
					href="https://github.com/Grod56/intelligent-irrigation"
					title="Github"
					target="_blank"
				>
					View GitHub Repository
				</a>
			</div>
		</div>
	);
};

export default Footer;
