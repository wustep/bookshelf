import { motion, useReducedMotion } from "framer-motion"
import "./Header.css"

/* ─────────────────────────────────────────────────────────
 * HEADER ENTRANCE STORYBOARD
 *
 *    0ms   wordmark rises + fades in
 *  120ms   subtitle fades in
 * ───────────────────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1]
const TIMING = { title: 0, subtitle: 0.12 }

export function Header() {
	const reduceMotion = useReducedMotion()

	const rise = (delay) =>
		reduceMotion
			? {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					transition: { duration: 0.3, delay },
				}
			: {
					initial: { opacity: 0, y: 12 },
					animate: { opacity: 1, y: 0 },
					transition: { duration: 0.6, delay, ease: EASE },
				}

	return (
		<header className="header">
			<div className="header__content">
				<motion.h1 className="header__title" {...rise(TIMING.title)}>
					bookshelf
				</motion.h1>
				<motion.p className="header__subtitle" {...rise(TIMING.subtitle)}>
					some of{" "}
					<a className="header__link" href="https://wustep.me">
						stephen
					</a>
					’s favorite books
				</motion.p>
			</div>
		</header>
	)
}
