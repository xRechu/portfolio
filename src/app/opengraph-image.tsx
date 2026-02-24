import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Jakub Reszka - strony internetowe, aplikacje mobilne i automatyzacje AI";
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					position: "relative",
					background:
						"radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.18), transparent 42%), radial-gradient(circle at 82% 84%, rgba(6, 95, 70, 0.2), transparent 44%), linear-gradient(145deg, #0b0f0d 0%, #0f1a16 52%, #13261f 100%)",
					color: "#EAF4EF",
					padding: "68px 72px",
					fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
					flexDirection: "column",
					justifyContent: "space-between",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						alignSelf: "flex-start",
						padding: "10px 18px",
						borderRadius: 999,
						border: "1px solid rgba(167, 243, 208, 0.35)",
						fontSize: 24,
						letterSpacing: "0.08em",
						textTransform: "uppercase",
						color: "#A7F3D0",
					}}
				>
					Jakub Reszka
				</div>

				<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
					<div
						style={{
							fontSize: 68,
							lineHeight: 1.08,
							fontWeight: 800,
							letterSpacing: "-0.03em",
							maxWidth: 980,
						}}
					>
						Strony internetowe i sklepy, które dowożą wynik
					</div>
					<div
						style={{
							fontSize: 34,
							lineHeight: 1.25,
							fontWeight: 520,
							color: "rgba(234, 244, 239, 0.88)",
						}}
					>
						Next.js · Medusa.js · Aplikacje mobilne · Automatyzacje AI
					</div>
				</div>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 10,
							fontSize: 24,
							color: "#A7F3D0",
						}}
					>
						<div
							style={{
								width: 10,
								height: 10,
								borderRadius: 999,
								background: "#34D399",
							}}
						/>
						Darmowa konsultacja
					</div>
					<div
						style={{
							fontSize: 24,
							color: "rgba(234, 244, 239, 0.74)",
						}}
					>
						jakubreszka.pl
					</div>
				</div>
			</div>
		),
		{
			...size,
		}
	);
}
