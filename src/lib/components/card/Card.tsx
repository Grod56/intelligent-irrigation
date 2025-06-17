import "./card.scss";

const Card = function ({
	children,
	title,
}: {
	children: React.ReactNode;
	title?: string;
}) {
	return (
		<div className="card">
			{title ? (
				<>
					<span className="title">{title}</span>
					<hr />
				</>
			) : (
				<></>
			)}
			{children}
		</div>
	);
};

export default Card;
