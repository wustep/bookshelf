import { motion } from "framer-motion"
import "./Loader.css"

export function Loader() {
	return (
		<motion.div
			className="loader"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{
				duration: 0.4,
				ease: [0.16, 1, 0.3, 1],
			}}
		>
			<div className="loader__books">
				<div className="loader__book loader__book--1" />
				<div className="loader__book loader__book--2" />
				<div className="loader__book loader__book--3" />
				<div className="loader__book loader__book--4" />
				<div className="loader__book loader__book--5" />
			</div>
			<p className="loader__text">Dusting off the shelves...</p>
		</motion.div>
	)
}
