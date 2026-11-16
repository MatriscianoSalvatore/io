/*
	About page: the cities of the story, drawn as stylised skylines.
	Bologna (San Luca, the Two Towers, the Neptune, San Petronio), London
	(Tower Bridge, a bike with its Beeline device), Milano (Duomo, Torre Velasca, Navigli)
	and Berlin (TV tower, Brandenburg Gate). Each one is painted on a canvas
	of logical size 1000x420; the middle stays low because the phone stands
	in front of it. Bikes, bus and tram are separate sprites, moved by CSS.
*/

(function () {
	'use strict';

	const W = 1000, H = 420, G = 372; // G = ground line

	function tools(x) {
		const d = {};
		d.R = (X, Y, w, h, c) => { x.fillStyle = c; x.fillRect(X, Y, w, h); };
		d.P = (pts, c) => { x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); x.closePath(); x.fillStyle = c; x.fill(); };
		d.C = (cx, cy, r, c) => { x.beginPath(); x.arc(cx, cy, r, 0, 6.2832); x.fillStyle = c; x.fill(); };
		d.L = (pts, c, lw) => { x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); x.strokeStyle = c; x.lineWidth = lw || 2; x.lineCap = 'round'; x.lineJoin = 'round'; x.stroke(); };
		// arch: (X, Y) is the bottom-left corner
		d.A = (X, Y, w, h, c) => { x.beginPath(); x.moveTo(X, Y); x.lineTo(X, Y - h + w / 2); x.arc(X + w / 2, Y - h + w / 2, w / 2, Math.PI, 0); x.lineTo(X + w, Y); x.closePath(); x.fillStyle = c; x.fill(); };
		d.win = (X, Y, cols, rows, dx, dy, w, h, c) => { x.fillStyle = c; for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) x.fillRect(X + i * dx, Y + j * dy, w, h); };
		d.ground = c => {
			const g = x.createLinearGradient(0, G - 70, 0, G);
			g.addColorStop(0, 'rgba(74,168,255,0)'); g.addColorStop(1, 'rgba(74,168,255,.12)');
			x.fillStyle = g; x.fillRect(0, G - 70, W, 70);
			d.R(0, G, W, H - G, c || '#0c1429');
			d.L([[0, G], [W, G]], 'rgba(160,190,240,.28)', 1.5);
		};
		d.water = (X, Y, w) => {
			const g = x.createLinearGradient(0, Y, 0, H);
			g.addColorStop(0, '#15396a'); g.addColorStop(1, '#0a1830');
			x.fillStyle = g; x.fillRect(X, Y, w, H - Y);
			for (let i = 0; i < Math.floor(w / 62); i++) d.L([[X + 18 + i * 62, Y + 14 + (i % 3) * 12], [X + 50 + i * 62, Y + 14 + (i % 3) * 12]], 'rgba(170,205,240,.28)', 2);
		};
		return d;
	}

	const FAR = '#16223f', FAR2 = '#1b2a4c', LIT = '#ffd98a';
	// Hairpins of the road to San Luca, bottom to top, in canvas units. The CSS animation `climb` follows the same points.
	const ROAD = [[14, 364], [150, 336], [56, 306], [132, 276]];

	/* --------------------------------------------------------------- Bologna */

	function bologna(x) {
		const d = tools(x);
		const brick = '#b8553c', brick2 = '#8f3f2c', lite = '#e9a57c', clay = '#d37a54';

		// low roofs in the middle, behind the phone
		d.P([[330, G], [330, 338], [372, 338], [372, 322], [404, 322], [404, 344], [470, 344], [470, 326], [520, 326], [520, 346], [600, 346], [600, 330], [650, 330], [650, 348], [690, 348], [690, G]], FAR);
		d.win(342, 350, 14, 1, 24, 0, 6, 8, 'rgba(255,217,138,.5)');

		// the hill with the Sanctuary of San Luca and its portico
		x.beginPath(); x.moveTo(0, G); x.lineTo(0, 306); x.quadraticCurveTo(96, 196, 176, 258); x.quadraticCurveTo(214, 300, 240, G); x.closePath();
		x.fillStyle = '#14233f'; x.fill();
		d.R(60, 214, 92, 34, clay); d.R(48, 226, 22, 22, brick2); d.R(142, 226, 22, 22, brick2);
		x.beginPath(); x.arc(106, 214, 29, Math.PI, 0); x.fillStyle = lite; x.fill();
		d.R(100, 172, 12, 15, clay); x.beginPath(); x.arc(106, 172, 7, Math.PI, 0); x.fillStyle = lite; x.fill();
		d.L([[106, 165], [106, 152]], lite, 2); d.L([[101, 157], [111, 157]], lite, 2);
		d.win(70, 228, 5, 1, 16, 0, 7, 12, '#3a2118');
		// the road up the hill, in three hairpins: the red bike climbs it (see ROAD below)
		d.L(ROAD, 'rgba(233,165,124,.34)', 5);
		d.L(ROAD, 'rgba(20,35,63,.9)', 1);
		for (let i = 0; i < 9; i++) {
			const t = i / 8, px = 166 + t * 62, py = 268 + t * t * 96;
			d.R(px - 1, py - 8, 13, 4, brick2); d.A(px, py + 12, 11, 17, lite);
		}

		// the Two Towers: Asinelli, and the leaning Garisenda
		d.P([[238, G], [242, 96], [270, 96], [274, G]], brick);
		d.R(234, 88, 44, 11, brick2); for (let i = 0; i < 5; i++) d.R(235 + i * 9.5, 80, 6, 9, brick2);
		d.R(249, 60, 14, 22, brick); d.P([[247, 60], [256, 46], [265, 60]], brick2);
		d.win(253, 130, 1, 7, 0, 32, 5, 12, '#3a1c14');
		d.P([[284, G], [296, 214], [322, 218], [318, G]], brick2);
		d.P([[294, 214], [324, 218], [324, 210], [295, 206]], '#7c3525');

		// the Fountain of Neptune
		const stone = '#aab3c2', stone2 = '#929db0', bronze = '#55665f';
		d.R(700, 356, 84, 16, stone); d.R(712, 340, 60, 16, stone2); d.R(726, 306, 32, 34, stone); d.R(720, 300, 44, 8, stone2);
		d.P([[734, 300], [738, 252], [752, 252], [754, 300]], bronze);
		d.C(745, 242, 9, bronze);
		d.L([[739, 264], [722, 282]], bronze, 5); d.L([[752, 260], [766, 246]], bronze, 5);
		d.L([[768, 300], [768, 206]], bronze, 3); d.L([[760, 216], [760, 204], [776, 204], [776, 216]], bronze, 3); d.L([[768, 204], [768, 196]], bronze, 3);

		// San Petronio: marble below, bare brick above
		const marble = '#ead7cd', dark = '#5a2c22';
		d.P([[800, G], [800, 286], [852, 264], [852, 216], [892, 170], [932, 216], [932, 264], [984, 286], [984, G]], '#a34d38');
		d.P([[800, G], [800, 318], [984, 318], [984, G]], marble);
		d.L([[800, 318], [984, 318]], '#c9b3a8', 2);
		[827, 852, 932, 957].forEach(px => d.L([[px, 318], [px, G]], '#d6c0b5', 2));
		d.A(874, G, 36, 66, dark); d.A(808, G, 15, 40, dark); d.A(834, G, 15, 40, dark); d.A(940, G, 15, 40, dark); d.A(962, G, 15, 40, dark);
		d.A(882, 256, 20, 46, '#3a1c14'); d.C(826, 298, 7, '#3a1c14'); d.C(958, 298, 7, '#3a1c14');

		d.ground();
	}

	/* ---------------------------------------------------------------- London */

	function london(x) {
		const d = tools(x);
		const stone = '#9aa6bd', stone2 = '#7d8aa3', blue = '#5aa9e6';

		// far skyline
		d.P([[330, 332], [362, 168], [394, 332]], FAR);
		d.R(410, 268, 44, 64, FAR); d.R(462, 240, 34, 92, FAR); d.R(504, 286, 62, 46, FAR);
		x.beginPath(); x.ellipse(620, 262, 28, 96, 0, 0, 6.2832); x.fillStyle = FAR; x.fill();
		d.R(660, 292, 30, 40, FAR);
		d.win(418, 278, 3, 4, 12, 13, 5, 6, 'rgba(255,217,138,.4)');
		d.R(940, 176, 26, 156, FAR2); d.P([[936, 176], [953, 132], [970, 176]], FAR2); d.C(953, 200, 9, LIT);

		d.water(0, 332, W);

		// Tower Bridge: walkways and chains first, then the towers in front
		d.R(230, 172, 540, 7, blue); d.R(230, 186, 540, 7, blue);
		for (let i = 0; i <= 26; i++) d.L([[230 + i * 20.77, 172], [230 + i * 20.77, 193]], 'rgba(90,169,230,.55)', 1.5);
		d.R(0, 306, W, 10, '#6f7c96'); d.R(0, 316, W, 5, '#55617a');
		for (let i = 0; i < 34; i++) d.L([[10 + i * 30, 306], [10 + i * 30, 296]], 'rgba(160,175,205,.5)', 1.5);
		d.L([[0, 296], [W, 296]], 'rgba(160,175,205,.5)', 1.5);
		const chain = (x0, x1, x2) => {
			x.beginPath(); x.moveTo(x0, 160); x.quadraticCurveTo(x1, 300, x2, 306); x.strokeStyle = blue; x.lineWidth = 5; x.stroke();
			for (let i = 1; i < 7; i++) {
				const t = i / 7, px = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2, py = (1 - t) * (1 - t) * 160 + 2 * (1 - t) * t * 300 + t * t * 306;
				d.L([[px, py], [px, 306]], 'rgba(90,169,230,.55)', 1.5);
			}
		};
		chain(202, 120, 20); chain(798, 880, 980);
		[230, 770].forEach(cx => {
			d.R(cx - 42, 318, 84, 60, stone2);
			d.R(cx - 28, 150, 56, 170, stone); d.R(cx - 28, 150, 8, 170, stone2); d.R(cx + 20, 150, 8, 170, stone2);
			d.P([[cx - 20, 150], [cx, 96], [cx + 20, 150]], stone2);
			[-28, 28].forEach(o => { d.R(cx + o - 5, 128, 10, 24, stone2); d.P([[cx + o - 7, 128], [cx + o, 106], [cx + o + 7, 128]], stone); });
			d.A(cx - 9, 306, 18, 40, '#27324d'); d.A(cx - 7, 262, 14, 30, '#27324d'); d.A(cx - 7, 218, 14, 26, '#27324d');
			d.L([[cx, 96], [cx, 82]], LIT, 2);
		});

		// the bike with the Beeline device and the red bus ride the deck: they are sprites (see below)
	}

	/* ---------------------------------------------------------------- Milano */

	function milano(x) {
		const d = tools(x);
		const m = '#e3ddd2', m2 = '#c9c1b4', dk = '#5b5346';

		// far towers behind the phone
		d.R(430, 262, 44, 110, FAR);
		d.R(520, 282, 54, 90, FAR); d.P([[606, G], [606, 214], [620, 162], [634, 214], [634, G]], FAR); d.L([[620, 162], [620, 122]], FAR, 3);
		d.R(348, 300, 60, 72, FAR);
		d.win(528, 292, 3, 5, 14, 14, 6, 7, 'rgba(255,217,138,.4)');

		// overhead tram wire
		d.L([[0, 304], [750, 304]], 'rgba(200,210,230,.28)', 1.5);
		[330, 660].forEach(px => d.L([[px, G], [px, 298]], '#2a3552', 3));

		// the Duomo
		d.P([[20, G], [20, 292], [70, 262], [70, 236], [120, 206], [120, 186], [160, 150], [200, 186], [200, 206], [250, 236], [250, 262], [300, 292], [300, G]], m);
		[[20, 292, 40], [45, 277, 34], [70, 236, 46], [95, 221, 34], [120, 186, 50], [140, 168, 30], [160, 150, 64], [180, 168, 30], [200, 186, 50], [225, 221, 34], [250, 236, 46], [275, 277, 34], [300, 292, 40]]
			.forEach(s => d.P([[s[0] - 4, s[1]], [s[0], s[1] - s[2]], [s[0] + 4, s[1]]], m2));
		d.C(160, 83, 4.5, '#ffd166');
		[70, 120, 200, 250].forEach(px => d.L([[px, G], [px, px === 120 || px === 200 ? 208 : 252]], m2, 3));
		d.A(146, G, 28, 56, dk); d.A(92, G, 20, 40, dk); d.A(208, G, 20, 40, dk); d.A(40, G, 16, 30, dk); d.A(264, G, 16, 30, dk);
		d.A(151, 284, 18, 48, '#7b7264'); d.A(96, 300, 10, 30, '#7b7264'); d.A(214, 300, 10, 30, '#7b7264');
		d.win(30, 318, 2, 1, 22, 0, 6, 12, '#7b7264'); d.win(268, 318, 2, 1, 22, 0, 6, 12, '#7b7264');

		// Torre Velasca: the shaft, and the wider top floors held by slanted struts
		const vel = '#b79382', vel2 = '#8f6f60', vx = 706;
		d.R(vx - 17, 232, 34, G - 232, vel);
		for (let i = 0; i < 5; i++) d.L([[vx - 17 + i * 8.5, 236], [vx - 17 + i * 8.5, G]], vel2, 1.5);
		d.win(vx - 13, 244, 4, 9, 8.5, 14, 4, 8, '#2a2f4a');
		d.R(vx - 27, 150, 54, 62, vel);
		for (let i = 0; i < 7; i++) d.L([[vx - 27 + i * 9, 150], [vx - 27 + i * 9, 212]], vel2, 1.5);
		d.win(vx - 23, 158, 6, 4, 9, 13, 4, 8, '#2a2f4a');
		[-1, 1].forEach(k => { for (let i = 0; i < 3; i++) d.L([[vx + k * (27 - i * 5), 212], [vx + k * 17, 234 + i * 3]], vel2, 2.5); });
		d.P([[vx - 30, 150], [vx - 22, 138], [vx + 22, 138], [vx + 30, 150]], vel2);
		d.R(vx - 6, 126, 12, 12, vel2); d.L([[vx, 126], [vx, 108]], vel2, 2);

		// the Navigli: canal, houses, a small bridge
		d.water(760, 348, 240);
		[['#d9a35f', 766, 62, 98], ['#c8674e', 830, 56, 118], ['#e2b98a', 888, 64, 90], ['#b9584a', 954, 46, 110]].forEach(h => {
			d.R(h[1], 348 - h[3], h[2], h[3], h[0]);
			d.P([[h[1] - 3, 348 - h[3]], [h[1] + h[2] / 2, 348 - h[3] - 14], [h[1] + h[2] + 3, 348 - h[3]]], '#7a3b2c');
			d.win(h[1] + 9, 348 - h[3] + 16, Math.max(1, Math.floor((h[2] - 10) / 20)), Math.floor((h[3] - 28) / 26), 20, 26, 9, 14, '#2a2f4a');
		});
		x.beginPath(); x.moveTo(780, 378); x.quadraticCurveTo(840, 324, 900, 378); x.lineWidth = 11; x.strokeStyle = '#8b93a8'; x.lineCap = 'round'; x.stroke();

		// piazza and rails
		d.R(0, G, 760, H - G, '#0c1429');
		d.L([[0, G], [760, G]], 'rgba(160,190,240,.28)', 1.5);
		d.L([[0, 388], [760, 388]], '#3a4666', 2); d.L([[0, 396], [760, 396]], '#3a4666', 2);
	}

	/* ---------------------------------------------------------------- Berlin */

	function berlin(x) {
		const d = tools(x);
		const sand = '#d4c3a0', sand2 = '#b3a281', copper = '#6e8f86';

		d.R(360, 286, 60, 86, FAR); d.R(430, 256, 44, 116, FAR); d.R(486, 300, 70, 72, FAR); d.R(566, 268, 40, 104, FAR); d.R(616, 304, 56, 68, FAR);
		d.win(438, 268, 3, 6, 12, 14, 5, 7, 'rgba(255,217,138,.4)');

		// the TV tower
		d.P([[170, G], [175, 176], [185, 176], [190, G]], '#b9c2d4');
		d.C(180, 164, 27, '#cfd6e4'); d.R(153, 160, 54, 6, '#8e98ad');
		d.R(176, 100, 8, 40, '#b9c2d4'); d.L([[180, 44], [180, 100]], '#b9c2d4', 2);
		for (let i = 0; i < 5; i++) d.R(178, 44 + i * 11, 4, 6, i % 2 ? '#ffffff' : '#e23b3b');
		d.R(120, 316, 40, 56, FAR2); d.R(204, 300, 50, 72, FAR2);

		// the Brandenburg Gate
		d.R(712, 356, 256, 16, sand2);
		for (let i = 0; i < 6; i++) d.R(724 + i * 44, 252, 18, 104, sand);
		d.R(712, 226, 256, 26, sand); d.R(712, 220, 256, 6, sand2); d.R(760, 196, 160, 26, sand);
		d.R(812, 178, 56, 18, copper);
		d.P([[818, 178], [824, 158], [832, 178]], copper); d.P([[838, 178], [846, 152], [854, 178]], copper); d.P([[858, 178], [864, 160], [870, 178]], copper);
		d.L([[846, 152], [846, 138]], copper, 3);

		d.ground();
	}

	/* -------------------------------------------------------------- sprites */

	function bus(x) { // 132 x 70
		const d = tools(x);
		x.beginPath(); x.moveTo(12, 4); x.lineTo(120, 4); x.quadraticCurveTo(128, 4, 128, 12); x.lineTo(128, 56); x.lineTo(4, 56); x.lineTo(4, 12); x.quadraticCurveTo(4, 4, 12, 4); x.closePath();
		x.fillStyle = '#e03131'; x.fill();
		d.R(4, 30, 124, 3, '#b32525');
		for (let i = 0; i < 6; i++) d.R(10 + i * 19.5, 10, 15, 14, '#ffe9c2');
		for (let i = 0; i < 4; i++) d.R(10 + i * 19.5, 36, 15, 13, '#ffe9c2');
		d.R(92, 36, 30, 20, '#7a1b1b');
		d.C(30, 58, 9, '#0b0f17'); d.C(30, 58, 4, '#8c93a3'); d.C(100, 58, 9, '#0b0f17'); d.C(100, 58, 4, '#8c93a3');
		d.R(123, 42, 5, 7, '#fff3b0');
	}

	// The bike of the London internship, with the Beeline device glowing on its handlebar. 124 x 122, wheels on the bottom edge.
	function bike(x) {
		const d = tools(x), bx = 26, by = 120;
		[bx, bx + 70].forEach(wx => { x.beginPath(); x.arc(wx, by - 22, 21, 0, 6.2832); x.strokeStyle = '#d5dbe8'; x.lineWidth = 3; x.stroke(); });
		d.L([[bx, by - 22], [bx + 30, by - 22], [bx + 52, by - 58], [bx + 18, by - 58], [bx + 30, by - 22]], '#2dd4a7', 3);
		d.L([[bx + 52, by - 58], [bx + 70, by - 22]], '#2dd4a7', 3);
		d.L([[bx + 18, by - 58], [bx + 16, by - 66]], '#d5dbe8', 3); d.L([[bx + 8, by - 66], [bx + 26, by - 66]], '#eef2f9', 5);
		d.L([[bx + 52, by - 58], [bx + 56, by - 72], [bx + 66, by - 74]], '#eef2f9', 3);
		const g = x.createRadialGradient(bx + 62, by - 86, 0, bx + 62, by - 86, 30);
		g.addColorStop(0, 'rgba(247,201,62,.55)'); g.addColorStop(1, 'rgba(247,201,62,0)');
		x.fillStyle = g; x.fillRect(bx + 30, by - 118, 64, 64);
		d.C(bx + 62, by - 86, 12, '#10182c');
		x.beginPath(); x.arc(bx + 62, by - 86, 12, 0, 6.2832); x.strokeStyle = '#f7c93e'; x.lineWidth = 3; x.stroke();
		d.L([[bx + 57, by - 82], [bx + 62, by - 92], [bx + 67, by - 82]], '#fff', 2.6);
	}

	// The red bike that climbs to San Luca, with its rider. 56 x 50, wheels on the bottom edge, facing right.
	function redBike(x) {
		const d = tools(x), red = '#ff4d4d', by = 48;
		[12, 44].forEach(wx => { x.beginPath(); x.arc(wx, by - 10, 9.5, 0, 6.2832); x.strokeStyle = '#eef2f9'; x.lineWidth = 2.4; x.stroke(); });
		d.L([[12, by - 10], [26, by - 10], [37, by - 26], [20, by - 26], [26, by - 10]], red, 3);
		d.L([[37, by - 26], [44, by - 10]], red, 3);
		d.L([[20, by - 26], [18, by - 31]], red, 2.4); d.L([[13, by - 31], [23, by - 31]], '#eef2f9', 3);
		d.L([[37, by - 26], [39, by - 33], [45, by - 34]], '#eef2f9', 2.4);
		// the rider, leaning on the handlebar
		d.L([[18, by - 32], [30, by - 44], [43, by - 34]], '#ffd98a', 3.4);
		d.L([[18, by - 32], [28, by - 20], [26, by - 10]], '#ffd98a', 3);
		d.C(33, by - 49, 5, '#ffd98a');
	}

	function tram(x) { // 170 x 70
		const d = tools(x);
		d.L([[62, 20], [84, 4], [106, 20]], '#aab3c6', 2); d.L([[72, 4], [96, 4]], '#aab3c6', 3);
		x.beginPath(); x.moveTo(16, 18); x.lineTo(154, 18); x.quadraticCurveTo(166, 18, 166, 30); x.lineTo(166, 56); x.lineTo(4, 56); x.lineTo(4, 30); x.quadraticCurveTo(4, 18, 16, 18); x.closePath();
		x.fillStyle = '#f2c230'; x.fill();
		d.R(4, 44, 162, 6, '#d99f1c');
		for (let i = 0; i < 7; i++) d.R(12 + i * 21.5, 24, 16, 16, '#fff7d6');
		d.C(40, 60, 6, '#0b0f17'); d.C(130, 60, 6, '#0b0f17');
		d.R(161, 34, 5, 7, '#fff3b0');
	}

	window.AboutCities = {
		W, H,
		list: [
			// sprites: y is the canvas line their bottom edge rests on; the class picks the CSS animation
			{ id: 'bologna', name: 'Bologna', at: '44.49°N 11.34°E', draw: bologna, sprites: [{ draw: redBike, w: 56, h: 50, y: 364, cls: 'climb' }] },
			{ id: 'london', name: 'London', at: '51.51°N 0.13°W', draw: london, sprites: [{ draw: bike, w: 124, h: 122, y: 306, cls: 'bike' }, { draw: bus, w: 132, h: 70, y: 306, cls: 'bus' }] },
			{ id: 'milano', name: 'Milano', at: '45.46°N 9.19°E', draw: milano, sprites: [{ draw: tram, w: 170, h: 70, y: 396, cls: 'tram' }] },
			{ id: 'berlin', name: 'Berlin', at: '52.52°N 13.40°E', draw: berlin }
		]
	};

})();
