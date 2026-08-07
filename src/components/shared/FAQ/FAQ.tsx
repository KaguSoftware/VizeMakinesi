"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FAQProps } from "./types";
import { FAQ_EYEBROW, FAQ_PAGE_SIZE } from "./constants";

// Direction-aware page swap. Exit is deliberately faster than enter so the
// wait-mode handoff (exit + enter, sequential) stays under ~380ms total.
const pageVariants = {
	enter: (dir: number) => ({
		opacity: 0,
		x: dir > 0 ? 28 : -28,
	}),
	center: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.22, ease: "easeOut" as const },
	},
	exit: (dir: number) => ({
		opacity: 0,
		x: dir > 0 ? -28 : 28,
		transition: { duration: 0.16, ease: "easeIn" as const },
	}),
};

export default function FAQ({ items, title }: FAQProps) {
	const [open, setOpen] = useState<Set<number>>(new Set());
	const [page, setPage] = useState(0);
	const [direction, setDirection] = useState(0);

	const pageCount = Math.ceil(items.length / FAQ_PAGE_SIZE);
	const paginated = pageCount > 1;
	const start = paginated ? page * FAQ_PAGE_SIZE : 0;
	const visible = paginated
		? items.slice(start, start + FAQ_PAGE_SIZE)
		: items;

	const goTo = (next: number) => {
		setDirection(next > page ? 1 : -1);
		setPage(next);
	};

	const toggle = (i: number) =>
		setOpen((prev) => {
			const next = new Set(prev);
			if (next.has(i)) next.delete(i);
			else next.add(i);
			return next;
		});

	return (
		<section className="pt-24 pb-4">
			<div className="container">
				<div className="grid grid-cols-1 md:grid-cols-[4fr_8fr] gap-20">
					{/* left */}
					<div>
						<div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
							{FAQ_EYEBROW}
						</div>
						<h2 className="font-serif font-bold text-[clamp(40px,5vw,60px)] leading-none tracking-tight">
							{title ?? (
								<>
									Questions,{" "}
									<em className="font-normal italic text-coral">
										answered.
									</em>
								</>
							)}
						</h2>
					</div>

					{/* right */}
					<div>
						<AnimatePresence
							mode="wait"
							initial={false}
							custom={direction}
						>
							<motion.div
								key={page}
								custom={direction}
								variants={pageVariants}
								initial="enter"
								animate="center"
								exit="exit"
							>
								{visible.map((it, li) => {
								const i = start + li;
								return (
								<div
									key={i}
									className="border-t border-border last:border-b"
								>
									<button
										className="w-full grid grid-cols-[40px_1fr_30px] gap-4 items-center text-left font-serif font-semibold text-[22px] tracking-tight text-navy hover:text-coral active:bg-coral/5 transition-colors duration-200 py-7 cursor-pointer focus-visible:outline-none focus-visible:bg-coral/5 -mx-2 px-2 rounded"
										onClick={() => toggle(i)}
									>
										<span className="font-mono font-medium text-[11px] tracking-[0.18em] text-coral uppercase">
											— {String(i + 1).padStart(2, "0")}
										</span>
										<span>{it.q}</span>
										<motion.span
											className="font-serif text-[28px] text-coral text-right leading-none"
											animate={{
												rotate: open.has(i) ? 45 : 0,
											}}
											transition={{
												duration: 0.25,
												ease: "easeInOut",
											}}
										>
											+
										</motion.span>
									</button>
									<AnimatePresence initial={false}>
										{open.has(i) && (
											<motion.div
												initial={{ height: 0, opacity: 0 }}
												animate={{
													height: "auto",
													opacity: 1,
												}}
												exit={{ height: 0, opacity: 0 }}
												transition={{
													duration: 0.3,
													ease: "easeInOut",
												}}
												style={{ overflow: "hidden" }}
											>
												<p className="text-muted text-base leading-relaxed pb-7 max-w-180 pl-14">
													{it.a}
												</p>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
								);
							})}
							</motion.div>
						</AnimatePresence>

						{paginated && (
							<div className="flex items-center justify-between gap-4 pt-8">
								<button
									type="button"
									onClick={() => goTo(page - 1)}
									disabled={page === 0}
									aria-label="Önceki sorular"
									className="grid place-items-center w-11 h-11 rounded-full border border-border text-coral text-[20px] leading-none transition-colors duration-200 hover:border-coral hover:bg-coral/5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:bg-coral/5"
								>
									←
								</button>

								<span className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
									{String(start + 1).padStart(2, "0")}–
									{String(start + visible.length).padStart(
										2,
										"0"
									)}{" "}
									/ {String(items.length).padStart(2, "0")}
								</span>

								<button
									type="button"
									onClick={() => goTo(page + 1)}
									disabled={page >= pageCount - 1}
									aria-label="Sonraki sorular"
									className="grid place-items-center w-11 h-11 rounded-full border border-border text-coral text-[20px] leading-none transition-colors duration-200 hover:border-coral hover:bg-coral/5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:bg-coral/5"
								>
									→
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
