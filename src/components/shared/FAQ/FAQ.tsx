"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FAQProps } from "./types";
import { FAQ_EYEBROW } from "./constants";

export default function FAQ({ items, title }: FAQProps) {
	const [open, setOpen] = useState<Set<number>>(new Set());

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
						{items.map((it, i) => (
							<div
								key={i}
								className="border-t border-border last:border-b"
							>
								<button
									className="w-full grid grid-cols-[40px_1fr_30px] gap-4 items-center text-left font-serif font-semibold text-[22px] tracking-tight text-navy hover:text-coral transition-colors duration-200 py-7 cursor-pointer"
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
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
