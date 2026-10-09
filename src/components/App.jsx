import { useRef, useState } from "react";
import Nav from "./Nav";
import hogsData from "../porkers_data";

const defaultImage = "/images/piglet.jpg";

function App() {
	const nextHogId = useRef(hogsData.length);
	const [hogs, setHogs] = useState(() =>
		hogsData.map((hog, index) => ({ ...hog, id: index })),
	);
	const [hiddenHogIds, setHiddenHogIds] = useState(() => new Set());
	const [expandedHogId, setExpandedHogId] = useState(null);
	const [greasedOnly, setGreasedOnly] = useState(false);
	const [sortBy, setSortBy] = useState("");
	const [newHog, setNewHog] = useState({
		name: "",
		weight: "",
		specialty: "",
		greased: false,
		image: "",
		medal: "",
	});

	const visibleHogs = hogs
		.filter((hog) => !hiddenHogIds.has(hog.id))
		.filter((hog) => !greasedOnly || hog.greased)
		.sort((first, second) => {
			if (sortBy === "name") return first.name.localeCompare(second.name);
			if (sortBy === "weight") return first.weight - second.weight;
			return 0;
		});

	function updateNewHog(event) {
		const { name, value, checked, type } = event.target;
		setNewHog((currentHog) => ({
			...currentHog,
			[name]: type === "checkbox" ? checked : value,
		}));
	}

	function addHog(event) {
		event.preventDefault();
		const hog = {
			id: nextHogId.current++,
			name: newHog.name.trim(),
			weight: Number(newHog.weight),
			specialty: newHog.specialty.trim(),
			greased: newHog.greased,
			image: newHog.image.trim() || defaultImage,
			"highest medal achieved": newHog.medal.trim() || "none",
		};

		setHogs((currentHogs) => [...currentHogs, hog]);
		setNewHog({
			name: "",
			weight: "",
			specialty: "",
			greased: false,
			image: "",
			medal: "",
		});
	}

	function hideHog(event, hogId) {
		event.stopPropagation();
		setHiddenHogIds((currentIds) => new Set(currentIds).add(hogId));
	}

	function toggleHogDetails(hogId) {
		setExpandedHogId((currentId) => (currentId === hogId ? null : hogId));
	}

	return (
		<div className="App">
			<Nav />

			<div className="ui stackable grid">
				<section className="sixteen wide column" aria-label="Hog controls">
					<div className="ui segment filterWrapper">
						<div className="field">
							<div className="ui checkbox">
								<input
									id="greased-only"
									type="checkbox"
									checked={greasedOnly}
									onChange={(event) => setGreasedOnly(event.target.checked)}
								/>
								<label htmlFor="greased-only">Greased Pigs Only?</label>
							</div>
						</div>
						<div className="field">
							<label htmlFor="sort-by">Sort by:</label>
							<select
								className="ui dropdown"
								id="sort-by"
								value={sortBy}
								onChange={(event) => setSortBy(event.target.value)}
							>
								<option value="">Unsorted</option>
								<option value="name">Name</option>
								<option value="weight">Weight</option>
							</select>
						</div>
					</div>
				</section>

				<section className="sixteen wide column">
					<div className="ui stackable four cards">
						{visibleHogs.map((hog) => (
							<div
								aria-label="hog card"
								aria-expanded={expandedHogId === hog.id}
								className="ui card hog-card"
								key={hog.id}
								onClick={() => toggleHogDetails(hog.id)}
								onKeyDown={(event) => {
									if (
										event.target === event.currentTarget &&
										(event.key === "Enter" || event.key === " ")
									) {
										event.preventDefault();
										toggleHogDetails(hog.id);
									}
								}}
								role="button"
								tabIndex={0}
							>
								<div className="image">
									<img src={hog.image} alt={`Photo of ${hog.name}`} />
								</div>
								<div className="content">
									<h3 className="header">{hog.name}</h3>
									{expandedHogId === hog.id && (
										<div className="description hog-details">
											<p>Specialty: {hog.specialty}</p>
											<p>
												Weight: <span>{hog.weight}</span>
											</p>
											<p>{hog.greased ? "Greased" : "Nongreased"}</p>
											<p className="achievementText">
												{hog["highest medal achieved"]}
											</p>
										</div>
									)}
								</div>
								<div className="extra content">
									<button
										className="ui button"
										onClick={(event) => hideHog(event, hog.id)}
										type="button"
									>
										Hide Me
									</button>
								</div>
							</div>
						))}
					</div>
				</section>

				<section className="sixteen wide column">
					<form className="ui form segment" onSubmit={addHog}>
						<h2>Add a Hog</h2>
						<div className="fields">
							<div className="four wide field">
								<label htmlFor="new-hog-name">Name:</label>
								<input
									id="new-hog-name"
									name="name"
									onChange={updateNewHog}
									required
									value={newHog.name}
								/>
							</div>
							<div className="three wide field">
								<label htmlFor="new-hog-weight">Weight:</label>
								<input
									id="new-hog-weight"
									min="0"
									name="weight"
									onChange={updateNewHog}
									required
									step="any"
									type="number"
									value={newHog.weight}
								/>
							</div>
							<div className="four wide field">
								<label htmlFor="new-hog-specialty">Specialty:</label>
								<input
									id="new-hog-specialty"
									name="specialty"
									onChange={updateNewHog}
									required
									value={newHog.specialty}
								/>
							</div>
							<div className="five wide field">
								<label htmlFor="new-hog-medal">Highest medal achieved:</label>
								<input
									id="new-hog-medal"
									name="medal"
									onChange={updateNewHog}
									value={newHog.medal}
								/>
							</div>
						</div>
						<div className="fields">
							<div className="ten wide field">
								<label htmlFor="new-hog-image">Image URL:</label>
								<input
									id="new-hog-image"
									name="image"
									onChange={updateNewHog}
									type="url"
									value={newHog.image}
								/>
							</div>
							<div className="six wide field">
								<div className="ui checkbox">
									<input
										checked={newHog.greased}
										id="new-hog-greased"
										name="greased"
										onChange={updateNewHog}
										type="checkbox"
									/>
									<label htmlFor="new-hog-greased">Greased?</label>
								</div>
							</div>
						</div>
						<button className="ui primary button" type="submit">
							Add Hog
						</button>
					</form>
				</section>
			</div>
		</div>
	);
}

export default App;
