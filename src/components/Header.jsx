import { motion } from "framer-motion"
import "./Header.css"

export function Header() {
	return (
		<motion.header
			className="header"
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.5,
				ease: [0.16, 1, 0.3, 1],
			}}
		>
			<div className="header__content">
				<motion.div
					className="header__brand"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.5,
						delay: 0.1,
						ease: [0.16, 1, 0.3, 1],
					}}
				>
					<span className="header__icon">✦</span>
					<h1 className="header__title">bookshelf</h1>
				</motion.div>
				<motion.p
					className="header__subtitle"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						duration: 0.5,
						delay: 0.2,
						ease: [0.16, 1, 0.3, 1],
					}}
				>
					here are some of stephen's favorite books
				</motion.p>
			</div>
		</motion.header>
	)
}
